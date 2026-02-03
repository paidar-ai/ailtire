<script>
    import { selectedNode } from "../stores/store.js";
    import ResizableLayout from "./ResizableLayout.svelte";
    import MetadataDetail from "./MetadataDetail.svelte";
    import DetailView from "./DetailView.svelte";
    import GraphView from "./GraphView.svelte";
    import DocumentationView from "./DocumentationView.svelte";
    import Menu from "./Menu.svelte";
    import GenAIView from "./GenAI/GenAIView.svelte";

    let currentView = "Graph";

    function showGraphView() {
        currentView = "Graph";
    }
    function showDocumentationView() {
        currentView = "Documentation";
    }

    function showGenAIPanel() {
        currentView = "GenAI";
    }

    $: myPanel =
        currentView === "Graph"
            ? { component: GraphView, props: { id: "mainWindow", currentView } }
            : currentView === "Documentation"
                ? { component: DocumentationView, props: { id: "mainWindow", currentView } }
                : { component: GenAIView, props: { id: "mainWindow", currentView } }; // Default to GenAIView if no match


    const menuItems = [
        { label: 'Graph', action: () => { showGraphView(); } },
        { label: 'Documentation', action: () => { showDocumentationView(); } },
        { label: 'Errors', action: () => {console.log('Errors')} },
        { label: 'Todo', action: () => {console.log('TODO')} },
        { label: 'Generative AI', action: () => {showGenAIPanel()} },
    ];

    function handleMenuClick(item) {
        // Handle menu click logic, e.g., navigation
        console.log('Selected Menu Item:', item);
    }
</script>

<Menu {menuItems} {handleMenuClick} ></Menu>
<div class="flex items-center justify-center h-full bg-gray-100 rounded">
    <ResizableLayout
            TopPanel={{ component: DetailView, props: { id: "preview", height: 100 } }}
            ContentPanel = {myPanel}
    />
</div>
