<script>
    import "../app.css";
</script>

<slot />

<style lang="postcss">
    :global(html) {
        font-family: Inter;
        background-color: theme(colors.gray.100);
    }

    :global(article) {
        padding: 1rem;
    }

    :global(.logofont) {
        font-family: gotmilk;
    }
</style>
  