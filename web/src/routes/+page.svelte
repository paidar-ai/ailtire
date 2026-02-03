<script>
    let { data } = $props();
    import { goto } from '$app/navigation';

    function selectActor(actor) {
        goto(`/actors/${actor.dir}/Dashboard`);
    }
    let actorPanels = data.actorPanels;

</script>

<style>
    /* Main container styles */
    .actor-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    /* Grid item styles */
    .actor-item {
        text-align: center;
        spacing: 50px;
        padding: 50px;
        font-size: 12px;
        font-family: Arial, sans-serif;
    }

    /* Image styles */
    .actor-item img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }

    /* Hover effect for images */
    .actor-item img:hover {
        transform: scale(1.05);
    }

    /* Text styles */
    .actor-item span {
        display: block;
        font-size: 1.5rem;
        margin-top: 10px;
        font-weight: bold;
        color: #fff;
    }

    /* Link decoration */
    .actor-item a {
        text-decoration: none;
        color: inherit;
    }

    .actor-item a:hover span {
        color: #007acc; /* Change text color when hovering */
    }

</style>

        <!-- Grid container -->
        <div class="actor-grid">
            {#each actorPanels as actorPanel}
                <div class="actor-item">
                    <a href="/actors/{actorPanel.dir}/Dashboard">
                        <img src="/actors/{actorPanel.dir}/image.png" width="250px" height="250px" alt="{actorPanel.name}" />
                        <span on:click={() => selectActor(actorPanel)}>{actorPanel.name}</span>
                    </a>
                </div>
            {/each}
        </div>
