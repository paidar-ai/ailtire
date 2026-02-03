<script>
    import {selectedValue} from "../stores/store.js";

    export let background = "#ffffaa";
    export let color = "#000000";
    export let item = null;

    let hoverDetail = ""; // Store the hover text to be displayed as a tooltip
    let showTooltip = false; // Boolean to toggle tooltip visibility
    let tooltipPosition = {x: 0, y: 0}; // Coordinates where the tooltip should appear
    const isArray = (value) => Array.isArray(value);

    // Helper function to determine if the value is an object but NOT an array
    const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
    const selectValue = (item) => {
        selectedValue.set({key: item.key, value: item.value});
    }

    export const handleMouseEnter = (event, item) => {
        showTooltip = true;
        tooltipPosition = {x: event.clientX + 10, y: event.clientY + 10}; // Position tooltip near the cursor
        if (isArray(item.value)) {
            hoverDetail = `<strong>${item.key}:</strong> Array (<i>${item.value.length}</i>)`;
        } else if (isObject(item.value)) {
            hoverDetail = `<ul>`;
            for (let vname in item.value) {
                if (vname[0] != '_') {
                    let stringValue = item.value[vname];
                    if (isObject(item.value[vname])) {
                        stringValue = Object.keys(item.value[vname]).join("... , ") + '...';
                    }
                    hoverDetail += `<li><strong>${vname}:</strong> <span>${stringValue}</span></li>`;
                }
            }
            hoverDetail += `</ul>\n`;
        } else {
            hoverDetail = `<strong>${item.key}:</strong> ${item.value}`;
        }
    };

    // Function to handle mouseleave (hover out)
    export const handleMouseLeave = () => {
        showTooltip = false; // Hide tooltip when mouse leaves
        hoverDetail = "";
    };
</script>
<div class="flex justify-between items-center border-b pb-1 hover:bg-gray-50 cursor-pointer"
     onmouseenter={(event) => handleMouseEnter(event, item)}
     onmousemove={(event) => (tooltipPosition = { x: event.clientX + 10, y: event.clientY + 10 })}
     onmouseleave={handleMouseLeave}
     onclick={() => selectValue(item)}>
    <slot></slot>
</div>
{#if showTooltip}
<div class="fixed bg-yellow-300 text-black text-sm rounded py-2 px-3 shadow-xl z-[9999] border border-yellow-400"
     style="background: {background}; color:{color}; top: {tooltipPosition.y}px; left: {tooltipPosition.x}px; pointer-events: none; transform: rotate(-1deg);">
    {@html hoverDetail}
</div>
{/if}