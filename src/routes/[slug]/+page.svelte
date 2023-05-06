<script>
    import { page } from '$app/stores';
    let {slug} = $page.params;
    import { onMount } from 'svelte';
    import {nip19, relayInit} from 'nostr-tools'
    let { nip05, premiumUrl, cachedProfile } = $page.data?.props || {};
    import { goto } from '$app/navigation';
    import defaultRelays from '../../relays.js';

    if (!nip05) {
        nip05 = slug;
    }

    let nostrJson, pubkey;
    let relays = {}, recommendedRelays = [], relaysWithProfile = [];
    let profile = {
        picture: 'https://robohash.org/1.png',
        banner: 'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80',
        ...cachedProfile
    };
    let fullProfile = {...cachedProfile};
    let npub;

    const { user, domain } = parseNip05(nip05);

    let sortedRelays = [];

    $: {
        sortedRelays = Object.keys(relays).sort((a, b) => {
            if (relays[a].status === 'success' && relays[b].status !== 'success') {
                return -1;
            } else if (relays[a].status !== 'success' && relays[b].status === 'success') {
                return 1;
            } else {
                return 0;
            }
        })
    }

    onMount(async () => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?${currentTimestamp}`).then(r => r.json());

        pubkey = nostrJson.names[user];
        npub = nip19.npubEncode(pubkey);

        if (!pubkey) {
            pubkey = nostrJson.names['_'];
        }

        if (!profile.display_name) profile.display_name = pubkey;
        if (!profile.name) profile.name = pubkey;

        if (pubkey && nostrJson.relays && nostrJson.relays[pubkey]) {
            nostrJson.relays[pubkey].forEach(relay => {
                relays[relay] = {
                    url: relay,
                    status: 'connecting',
                    noteCount: null
                };
            })
            recommendedRelays = nostrJson.relays[pubkey];
        } else {
            // no relays found, guess a few
            for (let r of defaultRelays) {
                relays[r] = { status: 'connecting' };
            }
        }

        for (const relayUrl in relays) {
            await fetchProfile(relayUrl);
        }
    })

    function parseNip05(slug) {
        if (slug.match(/@/)) {
            const [user, domain ] = slug.split('@');
            return {user, domain};
        } else {
            return { user: '_', domain: slug };
        }
    }

    async function recommendedRelay(event, relayUrl) {
        const recommended = event.content
        // recommendedRelays.push(recommended);
        // recommendedRelays = recommendedRelays;
        console.log('recommended relay received from', relayUrl, {recommended});
    }

    async function noteReceived(event, relayUrl) {
        relays[relayUrl].noteCount = 1;
        console.log('note received from', relayUrl);
    }

    async function profileReceived(event, relayUrl) {
        console.log('profile received', relayUrl);
        const p = JSON.parse(event.content);
        if (!p) { return; }

        for (const key in p) {
            if (!fullProfile[key]) {
                fullProfile[key] = p[key];
            }
        }

        relaysWithProfile.push(relayUrl)
        relaysWithProfile = relaysWithProfile;

        if (p.display_name) { profile.display_name = p.display_name; }
        if (p.name) { profile.name = p.name; }
        if (p.picture) { profile.picture = p.picture; }
        if (p.banner) { profile.banner = p.banner; }

        // notify the backend that we have a profile
        await fetch(`/api/profile/${slug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                profile: fullProfile
            })
        })
    }

    async function fetchProfile(relayUrl) {
        const relay = relayInit(relayUrl);
        relay.connect();
        relay.on('connect', async () => {
            console.log('fetching profile', relayUrl);
            relays[relayUrl].status = 'success'
            await relay.sub([{kinds: [0], authors: [pubkey]}]).on('event', async (e) => (await profileReceived(e, relayUrl)))
            await relay.sub([{kinds: [2], authors: [pubkey]}]).on('event', async (e) => (await recommendedRelay(e, relayUrl)))
            // await relay.sub([{kinds: [1], authors: [pubkey]}]).on('event', async (e) => (await noteReceived(e, relayUrl)))
            await relay.sub([{authors: [pubkey]}], async (e) => {
                console.log(e)
            })
        })
        relay.on('error', () => {
            relays[relayUrl].status = 'failed'
        })
    }
</script>

<svelte:head>
    <title>{cachedProfile?.display_name||slug} on Nostr</title>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="description" content="{cachedProfile?.display_name||slug} on Nostr">
    <meta name="author" content="pablof7z">
    <meta name="theme-color" content="#f6ad55">
    <meta name="twitter:site" content="@pablof7z">
    <meta name="twitter:creator" content="@pablof7z">
    <meta name="twitter:title" content="got nostr?">
    <meta name="twitter:description" content="{cachedProfile?.display_name||slug} on Nostr">
    <meta property="og:url" content="https://gotnostr.com/">
    <meta property="og:title" content="gotnostr.com">
    <meta property="og:description" content="{cachedProfile?.display_name||slug} on Nostr">
    <meta property="og:image:alt" content="gotnostr.com">
    <meta name="twitter:image" content="{cachedProfile?.picture}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <meta property="og:site_name" content="gotnostr.com">
</svelte:head>

<div class="flex min-h-full flex-col justify-center sm:px-6 lg:px-8 w-full">
    <div class="mt-8 sm:mx-auto w-full sm:max-w-3xl">
      <div class="bg-white shadow sm:rounded-lg">
        <article class="p-0 pb-7">
            <!-- Profile header -->
            <div>
              <div>
                <img class="h-32 w-full object-cover lg:h-48" src="{profile.banner}" alt="">
              </div>
              <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                  <div class="flex">
                    <img class="h-24 w-24 rounded-full ring-4 ring-purple-900 ring-4 sm:h-32 sm:w-32" src="{profile.picture}" alt="">
                  </div>
                  <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                    <div class="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                      <h1 class="truncate text-2xl font-bold text-gray-900">
                        {profile.display_name}
                      </h1>
                    </div>
                  </div>
                </div>
                <div class="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                  <h1 class="truncate text-2xl font-bold text-gray-900 text-purple-800 flex flex-row">
                    {#if premiumUrl}
                        <img src="/images/star.svg" class="w-6 mr-2" />
                    {/if}
                    {profile.display_name}
                    </h1>
                </div>
              </div>
            </div>
            <div class="bg-purple-900 text-white p-3 py-5 text-center">
                <span class="font-extrabold">Pubkey:</span>
                <span class="text-gray-200">
                    {npub}
                </span>
            </div>

            {#if Object.values(fullProfile) > 0}
            <pre>
                {JSON.stringify(fullProfile, null, 2)}
            </pre>
            {/if}

            <div class="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2">
                    <div class="">
                        <h3 class="text-2xl mb-3 font-bold text-gray-600">Suggested Relays</h3>

                        {#if recommendedRelays && recommendedRelays.length > 0}
                            <ul>
                                {#each recommendedRelays as relay}
                                    <li class="py-1 text-gray-400">
                                        {#if relays[relay].status === 'connecting'}
                                            <span class="animate-pulse">⏳</span>
                                        {:else if relays[relay].status === 'success'}
                                            <span class="">✅</span>
                                        {:else if relays[relay].status === 'failed'}
                                            <span class="">❌</span>
                                        {/if}
                                        {relay}

                                        {#if relays[relay].noteCount}
                                            <span class="text-gray-500">
                                                ({relays[relay].noteCount} notes)
                                            </span>
                                        {/if}
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            {#if relaysWithProfile && relaysWithProfile.length > 0}
                                <h4 class="mt-3">
                                    These relays have a profile for this user:
                                </h4>
                            {/if}

                            <ul>
                                {#each sortedRelays as relay}
                                    <li class="py-1 text-gray-400">
                                        {#if relays[relay].status === 'connecting'}
                                            <span class="animate-pulse">⏳</span>
                                        {:else if relays[relay].status === 'success'}
                                            <span class="">✅</span>
                                        {:else if relays[relay].status === 'failed'}
                                            <span class="">❌</span>
                                        {/if}
                                        {relay}
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </div>


                    <div>
                        {#if fullProfile}
                            {#if fullProfile.website}
                                <div class="flex flex-col">
                                    <span class="text-gray-600 font-semibold flex flex-row items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                        </svg>
                                        Website
                                    </span>
                                    <a href="{fullProfile.website}" class="text-purple-800">{fullProfile.website}</a>
                                </div>
                            {/if}

                            {#if fullProfile.about}
                                <div class="flex flex-col my-10">
                                    <div class="text-gray-500">{fullProfile.about}</div>
                                </div>
                            {/if}
                        {/if}
                    </div>

                </div>

                <div class="flex flex-row items-center justify-center my-5">
                    <div>
                        <a
                            href="https://snort.social/p/{npub}" class="
                                bg-purple-800
                                hover:bg-purple-700
                                text-white
                                font-light
                                py-2
                                md:px-10
                                text-xl
                                rounded-lg
                                w-full sm:w-fit
                            "
                            on:click={()=>{goto(`snort:${npub}`)}}
                        >Open</a>
                    </div>
                </div>
            </div>
      </div>
    </div>
  </div>