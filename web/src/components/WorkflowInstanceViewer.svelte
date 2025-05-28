<script>
    import { onMount } from "svelte";
    import { workflowInstanceNodes, fetchWorkflows, fetchRun} from "../stores/workflowsStore.js";
    import {selectedRun} from "../stores/store.js";

    let expandedRows = new Set();


    // Fetch events when the component mounts
    onMount(() => {
        fetchWorkflows();
    });
    async function selectRun(run) {
        await fetchRun(run);
    }

</script>

<div class="bg-white p-4 rounded shadow">
    <h3 class="text-sm font-bold mb-2">Workflow Runs</h3>
    <table class="table-auto min-w-full text-left border-collapse">
        <tbody>
        {#each $workflowInstanceNodes as workflowInstance}
            <!-- Render unique parent-level events -->
            <tr class="border-b state{workflowInstance.state} cursor-pointer flex items-center justify-between"
                on:click={() => {selectRun(workflowInstance)}}
            >
                    <!-- Parent Event Name -->
                    <td class="px-4 py-2 text-sm font-bold text-gray-800">
                        {workflowInstance.name}
                    </td>

                    <!-- Total Number of Subevents -->
                    <td class="px-4 py-2 text-sm text-gray-800">
                        {workflowInstance.startTime}
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-800">
                        <ul>
                        {#each Object.keys(workflowInstance.args) as key}
                            <li>{key}:{workflowInstance.args[key]}</li>
                        {/each}
                        </ul>
                    </td>
                </tr>
        {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 0.5rem;
        text-align: left;
    }
</style>