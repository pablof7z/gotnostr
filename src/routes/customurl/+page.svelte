<script>
    import PrimaryButton from '$lib/components/PrimaryButton.svelte';

    import NavBar from '$lib/components/NavBar.svelte';
    import Footer from '$lib/components/Footer.svelte';

    export let data;
    export let form;
</script>



<NavBar />

<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-50">
  <body class="h-full">
  ```
-->
<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-xl font-medium tracking-tight text-green-600">
          Thanks for your payment!
      </h2>
      <h2 class="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900">
        Let's get you setup
      </h2>
    </div>

    <pre>
        {JSON.stringify(form)}
    </pre>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" action="?/create" method="POST">
            <div>
                <label for="path" class="block text-lg font-medium text-gray-700">Enter your desired URL</label>
                <div class="mt-1 flex rounded-md shadow-sm">
                <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-lg">gotnostr.com/</span>
                <input type="text" name="path" id="path" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 sm:text-lg" value={form?.path??''} autofocus placeholder="YOU" required>
            </div>
            {#if form?.errors?.path}
                <p class="mt-2 text-sm text-red-600" id="email-error">{form.errors.path}</p>
            {/if}
            </div>

            <div>
                <label for="nip05" class="block text-lg font-medium text-gray-700">Your NIP-05</label>
                <div class="mt-1">
                <input id="nip05" name="nip05" type="nip05" autocomplete="nip05" required class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-lg">
                </div>
                {#if form?.errors?.nip05}
                    <p class="mt-2 text-sm text-red-600" id="email-error">{form.errors.nip05}</p>
                {/if}
            </div>
  
          <div>
            <PrimaryButton>
                Create your Custom URL
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </div>
  

<Footer />