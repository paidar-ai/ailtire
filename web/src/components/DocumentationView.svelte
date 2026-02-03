<script>
    import {selectedNode} from "../stores/store.js"
    import {Element} from "./elements/Element";
    import MDEditor from "./MDEditor.svelte";
    import {writable} from "svelte/store";
    export let currentView;

    const elementView = Element.Detail;

    let markdownContent = writable("TBD");

    $: if(currentView === "Documentation" && $selectedNode) {
        fetchDocumentation($selectedNode);
    }
    async function fetchDocumentation(node) {
        if (!node || !node.expandLink) return;

        try {
            markdownContent.set(""); // Reset content when fetching starts

            const response = await fetch(node.expandLink + '&doc=true'); // AJAX call for documentation
            if(response.status !== 200) throw new Error( response.statusText)
            let data = await response.json();
            markdownContent.set(data.document); // Update content
        } catch (error) {
            console.error(error);
        }
    }
    async function fetchGenAI() {
        let node = $selectedNode;
        if (!node || !node.expandLink) return;
        let genLink = node.expandLink.replace("get", "generate") + "&target=Documentation";
        const response = await fetch(genLink); // AJAX call for documentation
        if(response.status !== 200) throw new Error( response.statusText)
        let data = await response.json();
        markdownContent.set(data); // Update content
    }
    function handleUpdate(event) {
        markdownContent.set(event.detail);
    }

</script>

<div class={`h-full overflow-auto`}>
    <div class="bg-white p-4 border-r shadow">
        {#if $selectedNode}
            <p>Details about node ID: <strong>{$selectedNode.name}</strong></p>
            <div class="mt-4 space-y-2">
                {#if $selectedNode?._view?.hasOwnProperty("Detail")}
                    <svelte:component this={$selectedNode._view.Detail} element={$selectedNode} />
                {:else}
                    <svelte:component this={elementView} element={$selectedNode} />
                {/if}
            </div>
            <MDEditor bind:md={$markdownContent}
                      on:update={handleUpdate}
                      genai={fetchGenAI}
            />
        {:else}
            <p>No node selected.</p>
        {/if}
    </div>
</div>

<style>
    .graph-container {
        width: 100%;
        height: 100%;
        position: relative; /* This ensures proper layout handling */
    }

    /* Ensure the parent container also uses a size */
    .parent-container {
        height: 100%; /* 100% of the page viewport */
        overflow: hidden; /* Prevent unnecessary scrollbars */
    }
</style>
