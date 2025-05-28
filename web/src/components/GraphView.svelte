<script>
    import {onMount} from "svelte";
    import {graph} from "../stores/store.js"
    import {selectedNode, selectedClass, selectedClassList} from "../stores/store.js"
    import Menu from "./Menu.svelte";

    let graphData = {};

    let graphRef; // Reference for the graph container
    let graphObj;
    let graph2D = "<p>Not Available</p>";
    let graphView = "3D";

    // Render the 3D Graph on mount
    onMount(async () => {
        totalMenu.push(...menuItems);
        const {Graph3D} = await import('../lib/ailtire/Graph3D');
        if (graphRef) {
            graphObj = new Graph3D(graphRef, graphData, {});
            graph.set(graphObj);
        }
    });
    $: if ($selectedNode) {
        updateGraphData($selectedNode);
    }
    $: if($selectedClass) {
        updateGraphDataWithList($selectedNode, $selectedClassList);
    }

    async function updateGraphDataWithList(node, classList) {
        if(graphView === '3D') {
            if (node._view?.hasOwnProperty('get3DView')) {
                let data = node._view.get3DView(node);
                graphObj?.setData(data.nodes, data.links);
            } else {
                let data = {nodes: {}, links: []};
                data.nodes[node.id] = {id: node.id, name: node.name, color: node.color};
                data.links.push({source: node.id, target: node.id});
                graphObj?.setData(data.nodes, data.links);
            }
        } else {
            if(node._view?.hasOwnProperty('get2DView')) {
                graph2D = 'Fetching the diagram';
                let data = await node._view.get2DView(node);
                let graph2DDiv =  document.getElementById('preview2d');
                if(graph2DDiv) {
                    graph2DDiv.innerHTML = data;
                }
            } else {
                graph2D = "Not Available!";
            }
        }
    }
    async function updateGraphData(node) {

        totalMenu = [];
        for(let i in menuItems) {
            totalMenu.push(menuItems[i]);
        }
        if(node._view?.hasOwnProperty('getMenu')) {
            let menu = node._view.getMenu();
            for(let i in menu) {
                totalMenu.push(menu[i]);
            }
        }
        if(graphView === '3D') {
            if (node._view?.hasOwnProperty('get3DView')) {
                let data = node._view.get3DView(node);
                graphObj?.setData(data.nodes, data.links);
            } else {
                let data = {nodes: {}, links: []};
                data.nodes[node.id] = {id: node.id, name: node.name, color: node.color};
                data.links.push({source: node.id, target: node.id});
                graphObj?.setData(data.nodes, data.links);
            }
        } else {
            if(node._view?.hasOwnProperty('get2DView')) {
                graph2D = 'Fetching the diagram';
                let data = await node._view.get2DView(node);
                let graph2DDiv =  document.getElementById('preview2d');
                if(graph2DDiv) {
                    graph2DDiv.innerHTML = data;
                }
            } else {
                graph2D = "Not Available!";
            }
        }
    }
    let totalMenu = [];
    const menuItems = [
        { label: '2D', action: () => { graphView="2D"; updateGraphData($selectedNode) } },
        { label: '3D', action: () => { graphView="3D"; updateGraphData($selectedNode)} },
        { label: 'All', action: () => {console.log('All')} },
        { label: "Top Down", action: () => { graphObj.graph.dagMode("td") }},
        { label: "Bottom Up", action: () => { graphObj.graph.dagMode("bu") }},
        { label: "Left Right", action: () => { graphObj.graph.dagMode("lr") }},
        { label: "Right Left", action: () => { graphObj.graph.dagMode("rl") }},
        { label: "Z Out", action: () => { graphObj.graph.dagMode("zout") }},
        { label: "Z In", action: () => { graphObj.graph.dagMode("zin") }},
        { label: "Radial Out", action: () => { graphObj.graph.dagMode("radialout") }},
        { label: "Radial In", action: () => { graphObj.graph.dagMode("radialin") }},
    ];

    function handleMenuClick(item) {
        // Handle menu click logic, e.g., navigation
        console.log('Selected Menu Item:', item);
    }

</script>

<!-- Container for the 3D Graph -->
<div class="parent-container">
    {#if totalMenu.length > 0}
        <Menu bind:menuItems={totalMenu} {handleMenuClick} ></Menu>
    {/if}
    {#if graphView === '3D'}
        <div bind:this={graphRef} id="preview3d" class="graph-container"></div>
    {:else}
        <div id="preview2d">{graph2D}</div>
    {/if}
</div>

<style>
    .graph-container {
        width: 100%;
        height: 100%;
        position: relative; /* This ensures proper layout handling */
    }

    /* Ensure the parent container also uses a size */
    .parent-container {
        height: 100%; /* 100% of the page viewport */
        overflow: hidden; /* Prevent unnecessary scrollbars */
    }
</style>
