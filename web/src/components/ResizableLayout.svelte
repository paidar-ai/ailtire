<script>
    import { onMount } from "svelte";

    // Props for each panel
    export let TopPanel = { component: null, props: {} };
    export let LeftPanel = { component: null, props: {} };
    export let ContentPanel = { component: null, props: {} };
    export let RightPanel = { component: null, props: {} };
    export let BottomPanel = { component: null, props: {} };

    // Reactive state scoped to the instance

    let topHeight = TopPanel.props.height || 150; // Height of the TopPanel (scoped)
    let bottomHeight = BottomPanel.props.height || 150; // Height of the BottomPanel
    let leftWidth = LeftPanel.props.width || 250; // Width of the LeftPanel
    let rightWidth = RightPanel.props.width || 250; // Width of the RightPanel

    // Dragging state (temporary)
    let isDraggingTop = false;
    let isDraggingBottom = false;
    let isDraggingLeft = false;
    let isDraggingRight = false;

    // Drag handlers
    function startDragTop() {
        isDraggingTop = true;
    }

    function startDragBottom() {
        isDraggingBottom = true;
    }

    function startDragLeft() {
        isDraggingLeft = true;
    }

    function startDragRight() {
        isDraggingRight = true;
    }

    function stopDrag() {
        isDraggingTop = false;
        isDraggingBottom = false;
        isDraggingLeft = false;
        isDraggingRight = false;
    }

    function handleMouseMove(event) {
        if (isDraggingTop) {
            topHeight = Math.max(50, topHeight + event.movementY);
        }
        if (isDraggingBottom) {
            bottomHeight = Math.max(50, bottomHeight - event.movementY);
        }
        if (isDraggingLeft) {
            leftWidth = Math.max(100, leftWidth + event.movementX);
        }
        if (isDraggingRight) {
            rightWidth = Math.max(100, rightWidth - event.movementX);
        }
    }

    // Attach global listeners for resizing
    onMount(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDrag);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDrag);
        };
    });
</script>

<div class="resizable-layout flex flex-col w-full h-full overflow-hidden">
    <!-- TOP PANEL -->
    {#if TopPanel.component}
        <div class="top-panel" style={`height: ${topHeight}px;`}>
            <svelte:component this={TopPanel.component} {...TopPanel.props} />
            <div class="divider-horizontal-bottom" on:mousedown={startDragTop}></div>
        </div>
    {/if}

    <!-- MAIN AREA -->
    <div class="main-layout-container flex flex-grow overflow-hidden">
        <!-- LEFT PANEL -->
        {#if LeftPanel.component}
            <aside class="left-panel" style={`width: ${leftWidth}px;`}>
                <svelte:component this={LeftPanel.component} {...LeftPanel.props} />
                <div class="divider-vertical-right" on:mousedown={startDragLeft}></div>
            </aside>
        {/if}

        <!-- CONTENT AREA -->
        <main class="content-panel flex-grow overflow-auto bg-base-100 p-2">
            {#if ContentPanel.component}
                <svelte:component this={ContentPanel.component} {...ContentPanel.props} />
            {/if}
        </main>

        <!-- RIGHT PANEL -->
        {#if RightPanel.component}
            <aside class="right-panel" style={`width: ${rightWidth}px;`}>
                <div class="divider-vertical-left" on:mousedown={startDragRight}></div>
                <svelte:component this={RightPanel.component} {...RightPanel.props} />
            </aside>
        {/if}
    </div>

    <!-- BOTTOM PANEL -->
    {#if BottomPanel.component}
        <div class="bottom-panel" style={`height: ${bottomHeight}px;`}>
            <div class="divider-horizontal-top" on:mousedown={startDragBottom}></div>
            <svelte:component this={BottomPanel.component} {...BottomPanel.props} />
        </div>
    {/if}
</div>

<style>
    .resizable-layout {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .top-panel,
    .bottom-panel {
        position: relative;
        background-color: var(--tw-bg-base-300);
    }

    .left-panel,
    .right-panel {
        position: relative;
        background-color: var(--tw-bg-base-200);
        overflow: auto;
    }

    .divider-horizontal-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 4px;
        background-color: #ccc;
        cursor: row-resize;
        z-index: 1;
    }
    .divider-horizontal-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 4px;
        background-color: #ccc;
        cursor: row-resize;
        z-index: 1;
    }
    .divider-vertical-right {
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        background-color: #ccc;
        cursor: col-resize;
        z-index: 1;
    }
    .divider-vertical-left {
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background-color: #ccc;
        cursor: col-resize;
        z-index: 1;
    }
</style>