<script>
    import { onMount } from "svelte";
    import { eventNodes, fetchEvents } from "../stores/eventsStore.js";

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

    let expandedRows = new Set();


    // Fetch events when the component mounts
    onMount(() => {
        fetchEvents();
    });

    function getColor(event) {
        return scolor[event] || "#cc8844";
    }

    // Function to get unique top-level events
    function getUniqueTopLevelEvents(events) {
        const uniqueEvents = new Map(); // Map ensures uniqueness
        events.forEach(event => {
            const topLevelEvent = event.type.split(".")[0]; // Extract top-level name
            const lastMessage = event.data.message || "(No message)";
            if (!uniqueEvents.has(topLevelEvent)) {
                uniqueEvents.set(topLevelEvent, {
                    name: topLevelEvent,
                    lastMessage: lastMessage
                });
            }
        });
        return Array.from(uniqueEvents.values());
    }

    // Function to count total subevents for a given parent event
    function getSubeventDetails(eventType) {
        const subevents = $eventNodes.filter(event =>
            event.type.startsWith(`${eventType}.`)
        );

        // Group subevents by their name (after the first ".") and count occurrences
        const subeventMap = new Map();
        subevents.forEach(event => {
            const pieces = event.type.split(".");
            const subeventName = pieces.slice(1).join("."); // Extract subevent name
            if (subeventMap.has(subeventName)) {
                subeventMap.set(subeventName, subeventMap.get(subeventName) + 1);
            } else {
                subeventMap.set(subeventName, 1);
            }
        });

        // Convert the map to an array of objects
        return Array.from(subeventMap, ([name, count]) => ({ name, count }));
    }

    function toggleRow(type) {
        if(expandedRows.has(type)) {
            expandedRows.delete(type);
        } else {
            expandedRows.add(type);
        }
    }
    function getSubeventDetailsSorted(eventType) {
        const subevents = $eventNodes
            .filter(event => event.type.startsWith(`${eventType}.`))
            .sort((a, b) => {
                // Example sorting logic: reverse time order
                return b.timestamp - a.timestamp; // Newest first (assuming timestamp exists)
            });

        return subevents.map(event => ({
            name: event.type.split(".").slice(1).join("."),
            count: 1, // Can be aggregated if needed
            message: event.data.message || "(No message)"
        }));
    }
    function hasExpandedRow(event) {
        if(expandedRows.has(event)) {
            return true;
        } else {
            return false;
        }
    }
</script>

<div class="bg-white p-4 rounded shadow">
    <h3 class="text-sm font-bold mb-2">Events List</h3>
    <table class="table-auto min-w-full text-left border-collapse">
        <tbody>
        {#each getUniqueTopLevelEvents($eventNodes) as parentEvent}
            <!-- Render unique parent-level events -->
            <tr class="border-b">
                <!-- Parent Event Name -->
                <td class="px-4 py-2 text-sm font-bold text-gray-800">
                    {parentEvent.name}
                </td>

                <!-- Total Number of Subevents -->
                <td class="px-4 py-2 text-sm text-gray-800">
                    {getSubeventDetails(parentEvent.name).length}
                </td>

                <!-- Subevents (Inline with Counts + Tooltip) -->
                <td class="px-4 py-2 text-sm text-gray-800">
                    {#if getSubeventDetails(parentEvent.name).length > 0}
                        <!-- List subevents inline -->
                        {#each getSubeventDetails(parentEvent.name) as subevent, index}
                                <span
                                        class="cursor-default"
                                        title={subevent.name}
                                        style="padding:5px; margin: 3px;color:#ffffff; background: {getColor(subevent.name)}"
                                >
                                    {subevent.count}
                                </span>
                        {/each}
                    {:else}
                        <span class="text-gray-400">(No subevents)</span>
                    {/if}
                </td>

                <!-- Last Message -->
                <td class="px-4 py-2 text-sm text-gray-800">
                    {parentEvent.lastMessage}
                </td>
                <td>
                    <button
                            class="text-blue-500 underline"
                            on:click={() => toggleRow(parentEvent.name)}
                    >
                        {hasExpandedRow(parentEvent.name) ? "Collapse" : "Expand"}
                    </button>
                </td>
            </tr>
            {#if hasExpandedRow(parentEvent.name)}
                <tr class="bg-gray-50">
                    <td colspan="4" class="px-4 py-2">
                        <table class="table-auto min-w-full text-left">
                            <thead>
                            <tr class="border-b">
                                <th class="px-4 py-2 text-sm font-medium text-gray-600">
                                    Subevent Name
                                </th>
                                <th class="px-4 py-2 text-sm font-medium text-gray-600">
                                    Count
                                </th>
                                <th class="px-4 py-2 text-sm font-medium text-gray-600">
                                    Most Recent Message
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <!-- Render subevent details -->
                            {#each getSubeventDetailsSorted(parentEvent.name) as subevent}
                                <tr class="border-b">
                                    <td class="px-4 py-2 text-sm text-gray-800">
                                                <span
                                                        class="cursor-default underline decoration-dotted"
                                                        title={subevent.name}
                                                >
                                                    {subevent.name.split(".").pop()}
                                                </span>
                                    </td>
                                    <td class="px-4 py-2 text-sm text-gray-800">
                                        {subevent.count}
                                    </td>
                                    <td class="px-4 py-2 text-sm text-gray-800">
                                        {subevent.message}
                                    </td>
                                </tr>
                            {/each}
                            </tbody>
                        </table>
                    </td>
                </tr>
            {/if}
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

    .underline[title] {
        cursor: help; /* Show a tooltip icon pointer */
    }

    .text-gray-400 {
        color: #9ca3af; /* Tailwind's gray-400 */
    }
</style>