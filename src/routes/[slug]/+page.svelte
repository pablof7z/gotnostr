<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import {nip05} from 'nostr-tools'

    import {generatePrivateKey, getPublicKey, relayInit} from 'nostr-tools'

    let sk = generatePrivateKey()
    let pk = getPublicKey(sk)

    let nostrJson, pubkey, relays = {}, recommendedRelays = [];
    let profile = {
        picture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=1024&amp;h=1024&amp;q=80',
        banner: 'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80'
    };

    const slug = $page.params.slug;
    const { user, domain } = parseSlug(slug);

    onMount(async () => {
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
            relays['wss://brb.io'] = { url: 'wss://brb.io', status: 'connecting' };
            relays['wss://relay.damus.io'] = { url: 'wss://relay.damus.io', status: 'connecting' };
        }

        // call fetch profile for each relay passing the relay.url
        for (const relayUrl in relays) {
            await fetchProfile(relayUrl);
        }
    })

    function parseSlug(slug) {
        const [user, domain] = slug.split('@');
        return { user, domain };
    }

    async function profileReceived(event) {
        const p = JSON.parse(event.content);
        console.log(p);
        if (!p) { return; }

        if (p.display_name) { profile.display_name = p.display_name; }
        if (p.name) { profile.name = p.name; }
        if (p.picture) { profile.picture = p.picture; }
        if (p.banner) { profile.banner = p.banner; }
    }

    async function fetchProfile(relayUrl) {
        console.log('fetching profile from', relayUrl);
        const relay = relayInit(relayUrl);
        relay.connect();
        relay.on('connect', async () => {
            relays[relayUrl].status = 'success'
            await relay.sub([{kinds: [0], authors: [pubkey]}]).on('event', async (e) => (await profileReceived(e)))
        })
        relay.on('error', () => {
            relays[relayUrl].status = 'failed'
        })
    }
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                    <img class="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src="{profile.picture}" alt="">
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
                  <h1 class="truncate text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                </div>
              </div>
            </div>
            <div class="bg-purple-900 text-white p-3 py-5 text-center">
                <span class="font-extrabold">Pubkey:</span>
                <span class="text-gray-200">
                    {pubkey}
                </span>
            </div>


            {#if recommendedRelays && recommendedRelays.length > 0}
                <div class="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                    <h3 class="text-2xl mb-3 font-bold text-gray-600">Suggested Relays</h3>
                    <ul>
                        {#each recommendedRelays as relay}
                            <li class="py-1 text-gray-400">
                                {#if relays[relay].status === 'connecting'}
                                    <span class="animate-pulse">⏳</span>
                                {/if}
                                {#if relays[relay].status === 'success'}
                                    <span class="">✅</span>
                                {/if}
                                {#if relays[relay].status === 'failed'}
                                    <span class="">❌</span>
                                {/if}
                                {relay}
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
      </div>
    </div>
  </div>
