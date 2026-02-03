<script>
    import {modelNodes} from "../stores/packagesStore.js";
    import {selectedNode, selectedValue, selectedClass, selectedClassList} from "../stores/store.js";
    import {API_BASE_URL} from "../config.js";

    async function selectNode(node) {
        let url = node.link;
        selectedNode.set(null);
        selectedValue.set(null);
        selectedClassList.set(null);

        if(url) {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`API Error: ${res.statusText}`);
            }
            const data = await res.json();
            selectedClassList.set(data.records);
        }
        selectedClass.set(node);
    }
</script>

<div class="bg-white p-2 rounded shadow">
    <h3 class="text-sm font-bold">Class List</h3>
    <ul>
        {#each $modelNodes as node}
            <li>
                <div
                        class="cursor-pointer flex items-center justify-between"
                        on:click={async () => {
                            await selectNode(node); // Select the node on click
                        }}
                        class:highlight={$selectedNode === node} >

                    <div class="flex items-center">
                        <!-- Expand/Collapse toggle icon for folders -->
                        <!-- Icon based on node type -->
                        <span class="mr-2 icon ailtire-{node.type.toLowerCase()}"></span>
                        <!-- Node name -->
                        <span>{node.name}</span>
                    </div>
                    <div class="child-count"> {node.count} </div>
            </div>
            </li>
        {/each}
    </ul>
</div>
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
