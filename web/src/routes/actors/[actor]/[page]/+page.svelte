<script>
    let {data} = $props();
    import { writable} from "svelte/store";


    const MyComponent = writable(null);

    // Dynamically import .svelte files based on [actor] and [page]
    import(`../../../../../../actors/${data.actor}/views/svelte/pages/${data.page}.svelte`)
        .then((module) => {
            MyComponent.set(module.default);
        })
        .catch((error) => {
            console.error("Failed to load component:", error);
        });
</script>

{#if $MyComponent}
<svelte:component this="{$MyComponent}" />
{:else}
<p style="color:white">Loading...</p>
{/if}

