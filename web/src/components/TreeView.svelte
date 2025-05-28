<script>
    import TreeNode from "./TreeNode.svelte";

    export let nodes;

    let isLoading = false;
    let error = null

</script>

<div class="bg-white p-2 rounded shadow">
    <h3 class="text-sm font-bold">Architecture</h3>
    <ul>
        {#each nodes as node}
            <TreeNode {node} />
        {/each}
    </ul>
</div>
