<script>
    import { onMount } from "svelte";
    import { writable, derived } from "svelte/store";
    import TreeView from "./TreeView.svelte";
    import {fetchActors, actorNodes} from "../stores/actorsStore.js";
    import {fetchUsecases, usecaseNodes} from "../stores/usecasesStore.js";
    import {fetchPackages, packageNodes} from "../stores/packagesStore.js";
    import {fetchImplementations, componentNodes, imageNodes} from "../stores/implementationsStore.js";
    import {fetchDeployments, environmentNodes, physicalNodes} from "../stores/deploymentsStore.js";
    import {fetchWorkflows, workflowNodes} from "../stores/workflowsStore.js";

    // Example stores (you can replace this with your actual data logic)
    let topLevelNodesStore = writable([]);
    let childNodesStore = writable({}); // Object to store child nodes by parent ID
    export let nodes = [];

    $: nodes = $topLevelNodesStore;
    // Fetch top-level nodes
    async function fetchTopLevelNodes() {
        // Simulate fetching data
        await fetchActors();
        await fetchUsecases();
        await fetchPackages();
        await fetchImplementations();
        await fetchDeployments();
        await fetchWorkflows();
        const topNodes = [
            {
                id: "UseCaseView", name: "Use Case View", type: "Top", _view: { "D3": "none" }, _children: [
                    {id: "Actors", name: "Actors", type: "Top", _view: {"D3": "none" }, _children: $actorNodes},
                    {id: "UseCases", name: "Use Cases", type: "Top", _view: {"D3": "none"}, _children: $usecaseNodes}
                ]
            },
            { id: "Logical View", name: "Logical View", type: "Top", _view: {"D3": "none"}, _children: $packageNodes },
            { id: "Implementation View", name: "Implementation View", type: "Top", _view: {"D3": "none"}, _children: [
                    { id: "Libraries", name: "Libraries", type: "Top", _view: {"D3": "none"}, _children: $componentNodes },
                    { id: "Images ", name: "Images", type: "Top", _view: {"D3": "none"}, _children: $imageNodes },
                    ]},
            { id: "Deployment View", name: "Deployment View", type: "Top", _view: {"D3": "none"}, _children: [
                { id: "Logical Environments", name: "Logical Environments", type: "Top", _view: {"D3": "none"}, _children: $environmentNodes },
                { id: "Physical environments", name: "Physical", type: "Top", _view: {"D3": "none"}, _children: $physicalNodes },
            ]},
            { id: "Process View", name: "Process View", type: "Top", _view: {"D3": "none"}, _children: $workflowNodes }
        ];
        topLevelNodesStore.set(topNodes);
    }

    // Fetch child nodes for a specific node
    onMount(fetchTopLevelNodes);
</script>

<TreeView
        {nodes}
/>