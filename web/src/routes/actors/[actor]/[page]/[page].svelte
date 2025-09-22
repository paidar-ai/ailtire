<script context="module">
    export const load = async ({ params }) => {
        const {actor, page} = params;
    }
/*
        try {
            // Dynamically import the specific page
            console.log("Loading page:", actor, page);
            const Page = await import(`../../../../actors/${actor}/views/svelte/pages/${page}.svelte`);
            return { props: { Page: Page.default } };
        } catch (e) {
            console.error("Page or Actor not found:", e);
            return { status: 404 };
        }
    };

 */
</script>
<script>
//    export let Page; // Receive the dynamically loaded component
</script>

<!--
<svelte:component this={Page} />
-->

<h1>Actor: {params.actor}</h1>
<h1>Page: {params.page}</h1>
