<div class="px-6 pt-6 lg:px-8">
    <nav class="flex h-9 items-center justify-between" aria-label="Global">
        <div class="lg:min-w-0 lg:flex-1" aria-label="Global">
            <a href="/" class="">
                <h1 class="text-center text-purple-800 logofont text-3xl">got nostr?</h1>
            </a>
        </div>
    </nav>
</div>

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

<Footer />
