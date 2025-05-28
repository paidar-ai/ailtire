<script>
    export let menuItems = [];
    export let onMenuItemClick = (item) => {}; // Callback for handling menu item clicks
</script>

<nav class="top-menu bg-blue-500 text-white p-1">
    <ul class="menu-list flex justify-between">
        {#each menuItems as item}
            <li class="menu-item px-2 py-1 text-sm flex items-center gap-2" on:click={() => item.action && item.action()}>
                {#if item.class}
                    <i class={item.class} aria-hidden="true"></i> <!-- Render the class-based icon -->
                {/if}
                {item.label} <!-- Text label -->
            </li>
        {/each}
    </ul>
</nav>

<style>
    .top-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 50;
    }

    .menu-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
    }

    .menu-item {
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .menu-item:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
</style>