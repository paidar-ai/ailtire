<script>
    export let model = {}; // The model object provided
    export let data = []; // The array of objects to display
    import {selectedValue} from "../../../stores/store.js";

    // Sorting state
    let sortField = 'name'; // The current field being sorted
    let sortDirection = 'asc'; // 'asc' or 'desc'
    let sortedData = [];

    $: {
        if(data && model) {
            sortColumn("name");
        }
    }

    // Function to toggle sorting when a header is clicked
    function sortColumn(field) {
        if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortDirection = 'asc';
        }

        const fieldType = model.attributes[field]?.type || 'number';

        sortedData = data.slice().sort((a, b) => {
            const valA = a[field]?.name || a[field].count || '';
            const valB = b[field]?.name || b[field].count || '';

            const multiplier = sortDirection === 'asc' ? 1 : -1;

            switch (fieldType) {
                case 'number':
                    return (Number(valA) - Number(valB)) * multiplier;
                case 'date':
                    return (new Date(valA) - new Date(valB)) * multiplier;
                case 'boolean':
                    return ((valA === valB) ? 0 : valA ? -1 : 1) * multiplier;
                case 'json':
                    return (JSON.stringify(valA).localeCompare(JSON.stringify(valB))) * multiplier;
                default: // string
                    return valA.toString().localeCompare(valB.toString()) * multiplier;
            }
        });
    }

    function selectAttribute(name, attr) {
        selectedValue.set({key: name, value:attr.name});
    }
    function selectAssociation(name, assoc) {
        selectedValue.set({key: name, value:assoc.values});
    }

    function truncateText(text, maxLength = 30) {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    function formatJSON(json) {
        try {
            return JSON.stringify(json, null, 2);
        } catch (e) {
            return 'Invalid JSON';
        }
    }
    
</script>

<table>
    <thead>
        <tr>
            <!-- Display Headers for Attributes -->
            {#each Object.entries(model.attributes) as [key, value]}
                <th on:click={() => sortColumn(key)} class="sortable">
                    {key}
                    <!-- Sort indicator -->
                    {#if sortField === key}
                        {sortDirection === 'asc' ? ' 🔼' : ' 🔽'}
                    {/if}
                </th>
            {/each}

            <!-- Display Headers for Associations -->
            {#each Object.entries(model.associations) as [key, value]}
                <th on:click={() => sortColumn(key)} class="sortable">
                    {key}
                    <!-- Sort indicator -->
                    {#if sortField === key}
                        {sortDirection === 'asc' ? ' 🔼' : ' 🔽'}
                    {/if}
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        <!-- Display Rows of Data -->
        {#each sortedData as item}
        <tr>
                <!-- Show Attributes -->
                {#each Object.keys(model.attributes) as attrKey}
                    <td title={item[attrKey]?.name || ''} on:click={() => selectAttribute(attrKey,item[attrKey])} >
                        {#if model.attributes[attrKey].type === 'string'}
                            {truncateText(item[attrKey]?.name || '')}
                        {:else if model.attributes[attrKey].type === 'json'}
                            <span title={formatJSON(item[attrKey])}>Object</span>
                        {:else}
                            {truncateText(item[attrKey]?.name || '')}
                        {/if}
                    </td>
                {/each}

                <!-- Show Associations -->
                {#each Object.entries(model.associations) as [assocKey, assocValue]}
                    <td on:click={() => selectAssociation(assocKey, item[assocKey])} >
                        {#if assocValue.cardinality === 1}
                            <!-- Single associated object name with a link -->
                            <a href={`/detail/${assocValue.type}/${item[assocKey]?.id || ''}`}
                               title={item[assocKey]?.name || item[assocKey]?._name || 'Not Linked'}>
                                {truncateText(item[assocKey]?.name || item[assocKey]?._name || 'Not Linked')}
                            </a>
                        {:else}
                            <!-- Cardinality > 1 (plural) link to list -->
                            <a href={`/list/${assocValue.type}/${item[assocKey]?.length}`}
                               title={item[assocKey]?.count > 0 ? `${item[assocKey]?.count} Items` : '0 Items'}>
                                {truncateText(item[assocKey]?.count > 0 ? `${item[assocKey]?.count} Items` : '0 Items')}
                            </a>
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        font-size: 0.75rem;
        text-align: left;
    }
    th, td {
        padding: 0.75rem 1rem;
        border: 1px solid #ccc;
    }
    th {
        background-color: #f4f4f4;
        cursor: pointer; /* Add pointer cursor to indicate sortable columns */
    }
    th.sortable:hover {
        background-color: #e0e0e0; /* Highlight on hover */
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    a {
        text-decoration: none;
        color: #007bff;
        cursor: pointer;
    }
    a:hover {
        text-decoration: underline;
    }

    td[title] {
        cursor: help;
    }
</style>