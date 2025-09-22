<script>
    const baseDir = '../../../../../web/src';
    import "../../../../../web/src/app.css";

    let { children } = $props();

    import { onMount } from "svelte";
    import TreeView from "../../../../../web/src/components/TreeView.svelte";
    import ArchitectureTreeView from "../../../../../web/src/components/ArchitectureTreeView.svelte";
    import MetadataView from "../../../../../web/src/components/MetadataView.svelte";
    import MainView from "../../../../../web/src/components/MainView.svelte";
    import ClassList from "../../../../../web/src/components/ClassList.svelte";
    import ExecutionStatus from "../../../../../web/src/components/ExecutionStatus.svelte";
    import ResizableLayout from "../../../../../web/src/components/ResizableLayout.svelte";
    import TopMenu from "../../../../../web/src/components/TopMenu.svelte";
    import DetailView from "../../../../../web/src/components/DetailView.svelte";

    import { selectedNode, theme } from "../../../../../web/src/stores/store.js";

    onMount(() => {
        document.documentElement.setAttribute("data-theme", $theme);
    });

    function changeTheme(newTheme) {
        theme.set(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    }
</script>

<div class="flex flex-col h-screen w-full top-page">
    <!-- HEADER -->
    <header class="bg-primary text-white p-4 flex items-center justify-between header">
        <h1 class="text-xl font-bold">Architecture Explorer</h1>
        <select bind:value={$theme} onchange={(e) => changeTheme(e.target.value)}
                class="select select-bordered">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="synthwave">Synthwave</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="business">Business</option>
            <option value="night">Night</option>
        </select>
    </header>
    <main class="main-content">

        <ResizableLayout
                LeftPanel={{component: ArchitectureTreeView, props: {selectedNode}}}
                ContentPanel={{component:MainView, props: {}}}
                RightPanel={{component:ClassList, props: {}}}
                BottomPanel={{component:ExecutionStatus, props: {}}}
        />
    </main>
    <!-- FOOTER -->
    <footer class="bg-base-200 p-2 text-center text-sm footer" >
        <span>System Status: <strong>Online</strong></span>
    </footer>
</div>

<style>
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .header {
        height: 50px;
        background-color: #000000;
        display: flex;
    }
    .footer {
        height: 40px;
        display: flex;
    }
    .top-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }
    .main-content {
        flex-grow: 1;
        overflow: auto;
    }
</style>