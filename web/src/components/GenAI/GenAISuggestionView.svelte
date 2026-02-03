<script>
    import GenAIView from './GenAIView.svelte';
    import SuggestionsView from './SuggestionsView.svelte';
    import { writable } from "svelte/store";
    import DetailView from "./DetailView.svelte";
    import ResizableLayout from "./ResizableLayout.svelte";

    // Store for selected metadata detail
    let selectedSuggestion = writable(null);

    // Function to handle selection changes from MetadataView
    const handleSelectSuggestion = (sugg) => {
        selectedSuggestion.set(sugg); // Update the detail view
    };
</script>

<div class="flex items-center justify-center h-full bg-gray-100 rounded">
    <ResizableLayout
            ContentPanel={{component:GenAIView, props: {}}}
            RightPanel={{component:SuggestionsView, props: { }}}
    />
</div>