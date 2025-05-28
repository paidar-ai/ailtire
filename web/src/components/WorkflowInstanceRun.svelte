<script>
    import { onMount } from "svelte";
    import {selectedRun} from "../stores/store.js";

    const scolor = {
        started: "#00ffff",
        created: "#00ffff",
        inprogress: "#00aaff",
        blocked: "#ffbb44",
        completed: "#aaffaa",
        failed: "#ffaaaa",
        error: "#ffaaaa",
        enabled: "#aaffaa",
        disable: "#aaaaaa",
        rejected: "#ffaaaa",
        accepted: "#aaffff",
        update: "#aaffff",
        needed: "#ffbb44",
        selected: "#aaffaa",
        evaluated: "#ffffaa",
        moved: "#00ff00",
        nocontact: "#ff0000"
    };

    function getColor(event) {
        return scolor[event] || "#cc8844";
    }

    // Function to get unique top-level events
</script>

<div class="bg-white p-4 rounded shadow">
    <h3 class="text-sm font-bold mb-2">Run Activities</h3>
    <table class="table-auto min-w-full text-left border-collapse">
        <tbody>
        {#if $selectedRun}
            <tr><td>Made It</td></tr>
            {#each $selectedRun.activities as activity}
                <!-- Render unique parent-level events -->
                <tr class="border-b state{workflowInstance.state}">
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
        {:else}
            <tr>
                <td>Select a workflow or Scenario</td>
            </tr>
        {/if}
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

    .underline[title] {
        cursor: help; /* Show a tooltip icon pointer */
    }

    .text-gray-400 {
        color: #9ca3af; /* Tailwind's gray-400 */
    }

</style>