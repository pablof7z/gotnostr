<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let nostrJson, pubkey, relays = [];

    const slug = $page.params.slug;
    const { user, domain } = parseSlug(slug);

    onMount(async () => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?${currentTimestamp}`).then(r => r.json());

        pubkey = nostrJson.names[user];

        if (pubkey && nostrJson.relays) {
            relays = nostrJson.relays[pubkey];
        }
    })

    function parseSlug(slug) {
        const [user, domain] = slug.split('@');
        return { user, domain };
    }
</script>

<h2>Pubkey: {pubkey}</h2>

{#if relays && relays.length > 0}
    <h4>Recommended Relays: {relays.join(', ')}</h4>
{/if}

<pre>
    {JSON.stringify(nostrJson)}
</pre>