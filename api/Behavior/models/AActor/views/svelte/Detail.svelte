<script>
    export let element;
</script>
<div class="detail-view">
    <h3>Actor: {element.id}</h3>

    <!-- Display Name -->
    <div class="detail-item">
        <label>Name:</label>
        <p>{element.name}</p>
    </div>

    <!-- Display Description -->
    <div class="detail-item">
        <label>Description:</label>
        <p>{element.description}</p>
    </div>

</div>

<style>
    .detail-view {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .detail-item {
        margin-bottom: 15px;
    }

    .detail-item label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
    }

    .detail-item p {
        margin: 0;
        background: #fff;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>