<script>
    export let items = [];
    export let onSelect;
</script>

<ul>
    {#each items as item (item.id)}
        <li on:click={() => onSelect(item)}>
            <h3>{item.name}</h3>
            <p>{item.description || "TBD"}</p>
        </li>
    {/each}
</ul>