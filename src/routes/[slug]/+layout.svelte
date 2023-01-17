<script>
	import NavBar from '$lib/components/NavBar.svelte';
    import Footer from "$lib/components/Footer.svelte";
</script>

<div class="min-h-screen flex flex-col content-between">
    <div class="flex-start">
        <NavBar />
    </div>
    <div class="flex-1 flex-grow">
        <slot />
    </div>
    <div class="flex-end">
        <Footer />
    </div>
</div>
