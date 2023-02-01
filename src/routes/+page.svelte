<script>
	import Footer from './../lib/components/Footer.svelte';
  import { onMount } from 'svelte'
  import _ from 'lodash';
  import { createInvoice, checkInvoiceStatus, formatSatoshis, chooseRandomNumberFrom } from '$lib/utils.js';
  import { invoiceStatus } from '$lib/store.js';
  import QR from 'svelte-qr';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  export let form;

  if (browser && form?.success) {
    console.log({form})
    goto(`/${form.path}`)
  }

  let nip05;

  const price = 1;
  let invoice;
  let paid = false;
  let checkInterval;

  async function checkInvoiceForPayment() {
      console.log('checking invoice', invoice);
      if (!invoice) return;
      const status = await checkInvoiceStatus(invoice);
      console.log('status', status);
      if (status.paid) {
          invoiceStatus.set('paid')
          clearInterval(checkInterval);
      }
  }

    onMount(async () => {
        invoice = await createInvoice(price);

        checkInterval = setInterval(checkInvoiceForPayment, 2500);

        invoiceStatus.subscribe(async (value) => {
            if (invoice && value === 'check') {
                await checkInvoiceForPayment();
            }
        });
    })

    $: paid = $invoiceStatus === 'paid';
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
              <!-- <a href="#what" class="font-semibold text-gray-900 hover:text-gray-900">What is this?</a> -->
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

<div class="relative bg-white py-16 pb-0 -mt-60">
  <div class="px-6 lg:px-8 pb-24">
    <div class="mx-auto max-w-prose text-lg">
      <h1>
        <span class="mt-2 block text-center text-5xl font-black tracking-loose text-gray-900 sm:text-4xl xl:text-8xl">
          Easily shareable
          <span class="text-purple-800">Nostr</span>
          Identity</span>
      </h1>

      <p class="mt-8 text-xl leading-8 text-gray-400">
        <span class="text-black font-semibold">gotnostr</span>
        is a handy tool you can use to <b class="font-semibold text-black tracking-wide">verbally</b> (you know, like on a podcast).
      </p>
    </div>

    <div class="text-lg px-4 sm:px-6 lg:px-8 mt-4 mb-12 bg-gray-50">
      <div class="mx-auto max-w-5xl">
        <div class="flex flex-col sm:flex-row justify-between flex-auto py-10  bg-grid-slate-100 bg-gray-50 md:px-10 md:items-center">
          <div class="flex-1 md:w-24 bg-white shadow-lg p-8 text-slate-700 rounded-md  dark:bg-slate-800 dark:text-slate-400 h-full text-center flex flex-col align-middle justify-center h-100">
            <p class="break-words">
              <em>
                Find me on nostr at:
                <div class="text-purple-700 font-mono mt-3 block">npub1nstrcu63lzpjkz94djajuz2evrgu2psd66cwgc0gz0c0qazezx0q9urg5l</div>
              </em>
              
            </p>
          </div>
          <div class="md:flex-none p-2 sm:p-7 h-full text-center my-10 md:my-0">
            vs
          </div>
          <div class="flex-1 flex-grow bg-white shadow-lg p-8 text-slate-700 rounded-md  dark:bg-slate-800 dark:text-slate-400 h-full text-center flex flex-col align-middle justify-center h-100">
              Find me on nostr at:
              <div class="text-purple-700 font-mono mt-3 block">gotnostr.com/<b>pablo</b></div>
          </div>
        </div>
        <div class="mx-auto max-w-prose text-lg pb-20">
          <p class="mt-8 text-xl leading-8 text-gray-500">
            When people go to your <span class="text-purple-800">gotnostr</span> URL they'll see your
            nostr profile, along with your <code>pubkey</code> and your recommended relays where they can follow you.
          </p>
        </div>
      </div>
    </div>

    
  </div>
</div>




<div class="bg-white py-12 pt-0">
  <div class="mx-auto max-w-6xl sm:px-6 lg:px-8">
    <div class="relative isolate overflow-hidden bg-gray-900 sm:rounded-3xl p-10">
      <div class="
        mx-auto flex flex-col md:flex-row lg:mx-0 lg:items-center
        gap-8
      ">
      <div class="w-full md:w-3/5 xl:w-4/6">
        {#if !paid}
        <h3 class="text-lg font-semibold leading-8 tracking-tight text-indigo-400" id="tier-team">Vanity URL</h3>
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl md:leading-relaxed">Get an even <u>more</u> memorable URL</h2>
        
          <p class="text-lg leading-2 text-white/60">
            Get an awesome custom URL like <span class="text-white font-bold">gotnostr.com/<b>pablo</b></span>.
          </p>

          <div class="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-orange-500">
            15k
            <span class="text-2xl text-white font-extralight leading-8 tracking-normal ml-1">sats</span>
          </div>

          {:else}

          <h2 class="text-orange-500 text-xl my-3">
            <span class="text-3xl font-bold">Payment successful!</span>
            <span class="text-white block">Isn't ⚡️ LN incredible?!</span>
          </h2>
          <h3 class="text-lg text-gray-300">Let's go ahead and set up your memorable URL</h3>
          
          <form class="mt-4" action="?/create" method="POST">
            <div>
                <div class="mt-1 flex rounded-md shadow-sm">
                <span class="inline-flex items-center rounded-l-md rounded-b-none border border-r-0 border-gray-300 bg-white border-r-0 px-3 text-gray-400 sm:text-lg">gotnostr.com/</span>
                <input type="text" name="path" id="path" class="block w-full min-w-0 flex-1 rounded-none rounded-b-none rounded-r-md border-gray-300 border-l-0 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 sm:text-lg" value={form?.path??''} autofocus placeholder="YOU" required>
            </div>
            {#if form?.errors?.path}
                <p class="mt-2 text-sm text-red-600" id="email-error">{form.errors.path}</p>
            {/if}
            </div>

            <div>
                <input id="nip05" name="nip05" type="nip05" autocomplete="nip05" required class="block w-full appearance-none rounded-t-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-lg" placeholder="Your NIP-05 or pubkey">
                {#if form?.errors?.nip05}
                    <p class="mt-2 text-sm text-red-600" id="email-error">{form.errors.nip05}</p>
                {/if}
            </div>
          
          <div class="mt-4">
            <PrimaryButton disabled={!paid}>
                Create your Custom URL
            </PrimaryButton>
          </div>
        </form>
        {/if}
        </div>

        <div class="md:w-2/5 xl:w-2/6">
          {#if !paid}
            <div class="flex flex-col rounded-3xl bg-white">
              <div class="flex flex-1 flex-col justify-between rounded-2xl bg-gray-50 p-4">
                  {#if invoice?.payment_request}
                    <QR text={invoice.payment_request} />
                    <!-- <div class="p-3 px-4 rounded-xl w-full overflow-clip bg-slate-200 text-slate-700 my-2 font-mono">
                      <span class="text-ellipsis">
                        {invoice.payment_request}
                      </span>
                    </div> -->
                  {/if}
                  <a href="lightning:{invoice?.payment_request}" type="submit" name="choiceKey" value="custom gotnostr url" class="
                    mt-3
                    inline-block w-full rounded-lg bg-indigo-800 px-4 py-4 text-center text-lg font-medium leading-5 text-white shadow-md hover:bg-indigo-700">⚡️ Open in wallet</a>
                  </div>
                </div>
          {:else}
            <img src="https://psbt.io/images/paid.svg" class="w-full" />
          {/if}
      </div>
        
      </div>
      <svg class="pointer-events-none absolute top-1/2 left-12 -z-10 h-[42.375rem] -translate-y-1/2 transform-gpu blur-3xl lg:top-auto lg:bottom-[-12rem] lg:translate-y-0" viewBox="0 0 1155 678" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="url(#c0458c57-1330-459f-9d5c-f0d75c210466)" fill-opacity=".25" d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z" />
        <defs>
          <linearGradient id="c0458c57-1330-459f-9d5c-f0d75c210466" x1="1155.49" x2="-78.208" y1=".177" y2="474.645" gradientUnits="userSpaceOnUse">
            <stop stop-color="#9089FC"></stop>
            <stop offset="1" stop-color="#FF80B5"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</div>

<Footer />