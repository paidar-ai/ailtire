<script>
    import MetadataView from './MetadataView.svelte';
    import MetadataDetail from './MetadataDetail.svelte';
    import { writable } from "svelte/store";
    import Menu from "./Menu.svelte";
    import ResizableLayout from "./ResizableLayout.svelte";

    // Store for selected metadata detail
    let selectedMetadata = writable(null);

    // Function to handle selection changes from MetadataView
    const handleSelectMetadata = (metadata) => {
        selectedMetadata.set(metadata); // Update the detail view
    };
</script>

<div class="flex w-full h-full">
    <!-- Left Panel: MetadataView -->
    <MetadataView cls="w-1/2 border-r"
                  onSelectMetadata={handleSelectMetadata}
    />

    <!-- Right Panel: MetadataDetail -->
    <MetadataDetail cls="w-1/2"
                    bind:selectedMetadata={$selectedMetadata}
    />
</div>