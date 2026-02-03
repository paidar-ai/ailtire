<script>
    export let element;
</script>

<div class="form">
    <h3>Actor: {element.id}</h3>
    <label>Name:</label>
    <input type="text" bind:value={element.name} />

    <label>Description:</label>
    <textarea bind:value={element.description}></textarea>
</div>

<style>
    .form {
        display: flex;
        flex-direction: column;
    }
</style>
