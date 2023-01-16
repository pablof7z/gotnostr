<script>
    import "../app.css";
</script>

<slot />

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }

    :global(article) {
        padding: 1rem !important;
    }

    :global(.logofont) {
        font-family: gotmilk;
    }
</style>
  