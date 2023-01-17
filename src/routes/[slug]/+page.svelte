<script>
    
    import { page } from '$app/stores';
    let {slug} = $page.params;
    const { nip05, premiumUrl } = $page.data?.props || {};

    if (nip05) {
        slug = nip05;
    }
    
    import { onMount } from 'svelte';
    

    import {generatePrivateKey, getPublicKey, relayInit, getEventHash, signEvent} from 'nostr-tools'

    let privateKey = '0157ceecc36ae4e04097ff07a81e4e0ce802213f45799b3e1d1d79305e0b970b';

    let myRelay;
    let event;

    let nostrJson, pubkey;
    let relays = {}, recommendedRelays = [], relaysWithProfile = [];
    let profile = {
        picture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=1024&amp;h=1024&amp;q=80',
        banner: 'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80'
    };
    let fullProfile = {};

    const { user, domain } = parseSlug(slug);

    onMount(async () => {
        myRelay = await relayInit('wss://relay.damus.io');
        myRelay.connect();
        myRelay.on('connect', async () => {
            console.log('wss://relay.damus.io connected');
        });
        myRelay.on('error', async (e) => { console.log('wss://relay.damus.io connection failed', e) });

        const currentTimestamp = Math.floor(Date.now() / 1000);
        nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?${currentTimestamp}`).then(r => r.json());

        pubkey = nostrJson.names[user];

        if (!pubkey) {
            pubkey = nostrJson.names['_'];
        }
        
        profile.display_name = profile.name = pubkey;

        if (pubkey && nostrJson.relays && nostrJson.relays[pubkey]) {
            nostrJson.relays[pubkey].forEach(relay => {
                relays[relay] = {
                    url: relay,
                    status: 'connecting'
                };
            })
            recommendedRelays = nostrJson.relays[pubkey];
        } else {
            // no relays found, guess a few
            relays['wss://brb.io'] = { status: 'connecting' };
            relays['wss://relay.damus.io'] = { status: 'connecting' };
            relays['wss://nostr-2.zebeedee.cloud'] = { status: 'connecting' };
            relays['wss://nostr.coinos.io'] = { status: 'connecting' };
            relays['wss://nostr.oxtr.dev'] = { status: 'connecting' };
            relays['wss://nostr.rocks'] = { status: 'connecting' };
            relays['wss://nostr.v0l.io'] = { status: 'connecting' };
        }

        for (const relayUrl in relays) {
            await fetchProfile(relayUrl);
        }
    })

    function parseSlug(slug) {
        if (slug.match(/@/)) {
            const [user, domain ] = slug.split('@');
            return {user, domain};
        } else {
            return { user: '_', domain: slug };
        }
    }

    async function profileReceived(event, relayUrl) {
        const p = JSON.parse(event.content);
        if (!p) { return; }

        for (const key in p) {
            if (!fullProfile[key]) {
                fullProfile[key] = p[key];
            }
        }

        relaysWithProfile.push(relayUrl)

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
            relays[relayUrl].status = 'success'
            await relay.sub([{kinds: [0], authors: [pubkey]}]).on('event', async (e) => (await profileReceived(e, relayUrl)))
            await relay.sub([{authors: [pubkey]}], async (e) => {
                console.log(e)
            })
        })
        relay.on('error', () => {
            relays[relayUrl].status = 'failed'
        })
    }
</script>

<div class="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
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
                    {pubkey}
                </span>
            </div>

            {#if Object.values(fullProfile) > 0}
            <pre>
                {JSON.stringify(fullProfile, null, 2)}
            </pre>
            {/if}

            <div class="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                <h3 class="text-2xl mb-3 font-bold text-gray-600">Suggested Relays</h3>

                {#if recommendedRelays && recommendedRelays.length === 0}
                    <h4>
                        This user doesn't have any relays in their NIP-05.
                    </h4>
                {/if}

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
                        {#each Object.keys(relays) as relay}
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
      </div>
    </div>
  </div>