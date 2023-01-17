<script>
	import Footer from './../lib/components/Footer.svelte';
  import {generatePrivateKey, getPublicKey, relayInit} from 'nostr-tools'
  import { onMount } from 'svelte'
  import defaultRelays from '../relays';
  import niceNip05 from '../nip05';
  import _ from 'lodash';

  let currentRelay;
  const relays = _.shuffle(defaultRelays);
  let keys = {};
  let relayIndex = 0;
  let nip05;
  let relay;
  let recentProfiles = [];

  async function receivedRecentProfiles(event) {
    console.log('receivedRecentProfiles!');
    console.log(event);
    const profile = JSON.parse(event.content);
    // check if this profile already exists in the array, if not, unshift it
    if (!recentProfiles.find(p => p.nip05 === profile.nip05)) {
      recentProfiles.unshift(profile)
      recentProfiles = recentProfiles;
    }
  }

  async function requestRecentProfiles() {
    console.log('requestRecentProfiles');
    let sub = relay.sub([
      { ids: [
        '87c28dc0ebb55921518065ede4bc0bb6ec459f8c414e9820fe94aeb5ae6e724f'
      ]},
      { authors: ['0d8e0258047d38cd16dab019f1b44123f9c2f981d1ce0a313f6374687eba923e']}
    ])
    sub.on('event', async (e) => {await receivedRecentProfiles(e)})
  }

  async function connectToNextRelay() {
    currentRelay = relays[relayIndex];
    console.log(`[${currentRelay} Attempting to connect`)
    relay = await relayInit(currentRelay);
    relay.connect();
    relay.on('connect', async () => {
      console.log(`[${currentRelay}] Connected`)
      requestRecentProfiles();
    })
    relay.on('error', async () => {
      console.log(`[${currentRelay}] Failed to connect`)

      if (currentRelay) {
        await connectToNextRelay();
      } else {
        console.log(`No more relays available (with index ${relayIndex})`)
      }
    })
  }

  onMount(async () => {
    await connectToNextRelay()
  })
</script>

<div class="isolate bg-white min-h-screen items-stretch justify-between flex flex-col">
    <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
      <svg class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]" viewBox="0 0 1155 678" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)" fill-opacity=".3" d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z" />
        <defs>
          <linearGradient id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533" x1="1155.49" x2="-78.208" y1=".177" y2="474.645" gradientUnits="userSpaceOnUse">
            <stop stop-color="#9089FC"></stop>
            <stop offset="1" stop-color="#FF80B5"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="flex-shrink flex flex-row items-center">
        <nav class="flex p-3 items-center mx-auto" aria-label="Global">
          <div class="flex-1">
            <div class="min-w-0 px-4 justify-center gap-x-4 lg:gap-x-12">
              <a href="#what" class="font-semibold text-gray-900 hover:text-gray-900">What is this?</a>
            </div>
          </div>
        </nav>
    </div>
    <main class="flex-grow">
        <form action="/{nip05}">
      <div class="relative px-6 lg:px-8">
        <div class="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div>
              <h1 class="text-6xl font-bold tracking-tight text-center sm:text-9xl text-purple-800 logofont">got nostr?</h1>
              <p class="mt-6 text-lg leading-8 text-gray-400 text-center sm:text-3xl">
                The simple way to share your nostr identity
                <br>
                <span class="text-"></span>
              </p>

              <div class="my-3 md:my-10">
                <div class="relative mt-1 rounded-3xl shadow-sm">
                  <div class="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center pl-3">
                    <span class="text-purple-200 sm:text-3xl">gotnostr.com/</span>
                  </div>
                  
                    <input type="text" class="block w-full rounded-3xl border-gray-300 pl-16 focus:border-indigo-500 focus:ring-indigo-500 sm:pl-60 text-center py-5 sm:text-6xl text-purple-700 fontlogo" placeholder="your NIP-05" bind:value={nip05}>
                </div>
                
                <p class="mt-3 text-center">
                    <b>Example:</b>
                    <a href="/pablo@f7z.io" class="text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50">https://gotnostr.com/pablo@f7z.io</a>
                </p>
            </div>

              <div class="mt-8 flex gap-x-4 sm:justify-center">
                <button type="submit" class="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700">
                  Get started
                  <span class="text-indigo-200" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
            <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
              <svg class="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]" viewBox="0 0 1155 678" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)" fill-opacity=".3" d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z" />
                <defs>
                  <linearGradient id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc" x1="1155.49" x2="-78.208" y1=".177" y2="474.645" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#9089FC"></stop>
                    <stop offset="1" stop-color="#FF80B5"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </form>
  </main>
</div>

<div class="bg-white py-16">
  <div class="px-6 lg:px-8 pb-24">
    <div class="mx-auto max-w-prose text-lg">
      <h1>
        <span class="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">Easily shareable Nostr Identity</span>
      </h1>

      <p class="mt-8 text-xl leading-8 text-gray-500">
        <span class="text-purple-800">gotnostr</span>
        is a handy tool you can use to <em>verbally</em> (you know, like on a podcast).
      </p>
    </div>

    <div class="text-lg px-4 sm:px-6 lg:px-8 mt-4 mb-12 bg-gray-50">
      <div class="mx-auto max-w-5xl">
        <div class="flex flex-col sm:flex-row justify-between flex-auto py-10  bg-grid-slate-100 bg-gray-50 md:px-10 md:items-center">
          <div class="flex-1 md:w-24 bg-white shadow-lg p-8 text-slate-700 rounded-md  dark:bg-slate-800 dark:text-slate-400 h-full text-center flex flex-col align-middle justify-center h-100">
            <p class="break-words">
              <em>
                Find me on nostr at:
                <div class="text-white font-mono mt-3 block">npub1nstrcu63lzpjkz94djajuz2evrgu2psd66cwgc0gz0c0qazezx0q9urg5l</div>
              </em>
              
            </p>
          </div>
          <div class="md:flex-none p-2 sm:p-7 h-full text-center my-10 md:my-0">
            vs
          </div>
          <div class="flex-1 flex-grow bg-white shadow-lg p-8 text-slate-700 rounded-md  dark:bg-slate-800 dark:text-slate-400 h-full text-center flex flex-col align-middle justify-center h-100">
              Find me on nostr at:
              <div class="text-white font-mono mt-3 block">gotnostr.com/<b>pablo</b></div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-prose text-lg">
      <p class="mt-8 text-xl leading-8 text-gray-500">
        When people go to your <span class="text-purple-800">gotnostr</span> URL they'll see your
        nostr profile, along with your <code>pubkey</code> and your recommended relays where they can follow you.
      </p>
    </div>
  </div>
</div>

<div class="bg-gray-900">
  <div class="relative overflow-hidden pt-32 pb-80 lg:pt-20">
    <div><img class="absolute bottom-0 left-1/2 w-[1440px] max-w-none -translate-x-1/2" src="https://tailwindui.com/img/component-images/grid-blur-purple-on-black.jpg" alt=""></div>
  </div>
  <div class="flow-root bg-gray-100">
    <div class="relative -mt-80">
      <div class="relative z-10 mx-auto px-6 lg:px-8">
        <div class="mx-auto max-w-md lg:max-w-4xl flex flex-row">
          <div class="flex-1">
            <p class="mt-2 text-4xl font-bold tracking-tight text-white leading-normal">Get an even <u>more</u> <br class="hidden hidden lg:inline">memorable URL</p>
            <p class="mt-6 text-lg leading-8 text-white/60">
              15k sats get you an awesome custom URL like <span class="text-white font-bold">gotnostr.com/<b>pablo</b></span>.
            </p>
            <p class="text-sm leading-8 text-white/60">
              (no, you can't trade custom URLs as an NFT, shitcoiner)
            </p>
          </div>
          <div class="flex-1 flex flex-col rounded-3xl bg-white shadow-xl ring-1 ring-black/10">
            <div class="p-8 sm:p-10">
              <h3 class="text-lg font-semibold leading-8 tracking-tight text-indigo-600" id="tier-team">Vanity URL</h3>
              <div class="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-900">
                15k
                <span class="text-lg font-semibold leading-8 tracking-normal text-gray-500 ml-2">sats</span>
              </div>
              <p class="mt-6 text-base leading-7 text-gray-600">Get a short and sweet URL to share verbally for a one-time LN payment.</p>
            </div>
            <div class="flex flex-1 flex-col p-2">
              <div class="flex flex-1 flex-col justify-between rounded-2xl bg-gray-50 p-6 sm:pt-0 sm:p-8">
                <div class="">
                  <form method="POST" action="https://f7z.io/apps/3z91z6rk95jtPR9YeqvDcQh56Y3C/pos">
                    <input type="hidden" name="email" value="customer@example.com" />
                    <input type="hidden" name="orderId" value="CustomOrderId" />
                    <button type="submit" name="choiceKey" value="custom gotnostr url" class="inline-block w-full rounded-lg bg-indigo-600 px-4 py-4 text-center text-lg font-medium leading-5 text-white shadow-md hover:bg-indigo-700">⚡️ Go to BtcPay Server</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="flex"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<Footer />