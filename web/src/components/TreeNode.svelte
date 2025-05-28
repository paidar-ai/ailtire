<script>
    export let node; // A single node passed down as a prop
    import { selectedNode, selectedValue } from "../stores/store.js";
    import { writable } from 'svelte/store';
    import TreeNode from "./TreeNode.svelte";
    let isExpanded = writable(false);

    function selectNode() {
        selectedNode.set(node);
        selectedValue.set(null);
    }
    function toggleExpand() {
        isExpanded.update((isExpanded) => !isExpanded);
    }
</script>

{#if node}
<li>
    <div
            class="cursor-pointer flex items-center justify-between"
            on:click={() => {
            toggleExpand();
            selectNode(); // Select the node on click
        }}
            class:highlight={$selectedNode === node} >
        <div class="flex items-center">
            <!-- Expand/Collapse toggle icon for folders -->
            {#if node._children?.length > 0}
                    <span class="mr-2">
                        {#if $isExpanded}
                            <span class="mr-2 ailtire-collapsed"></span>
                        {:else}
                            <span class="mr-2 ailtire-expanded"></span>
                        {/if}
                    </span>
            {:else}
                <span class="mr-2">&nbsp;</span> <!-- Placeholder for alignment -->
            {/if}

            <!-- Icon based on node type -->
            <span class="mr-2 icon ailtire-{node.type.toLowerCase()}"></span>

            <!-- Node name -->
            <span>{node.name}</span>
        </div>

        <!-- Display number of children in a circle if there are children -->
        {#if node._children?.length > 0}
            <div class="child-count">
                {node._children.length}
            </div>
        {/if}
    </div>

    <!-- Render children nodes if they exist and the node is expanded -->
    {#if $isExpanded && node._children?.length > 0}
        <ul class="ml-4">
            {#each node._children as child}
                <!-- Recursive rendering of children -->
                <TreeNode node={child} />
            {/each}
        </ul>
    {/if}
</li>
{/if}
<style>
    ul {
        list-style-type: none; /* Remove default bullet points */
    }

    li div {
        margin: 4px 0;
    }

    .highlight {
        background-color: lightblue; /* Highlight selected node */
        border-radius: 4px;
    }

    .child-count {
        background-color: #e7f0fc;
        color: #667274;
        border: 1px solid #6f9dc7;
        border-radius: 20px;
        width: auto;
        height: 18px;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        min-width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0px #e6e6e6;
        text-shadow: 1px 1px 1px #e6e6e6;
    }
</style>
