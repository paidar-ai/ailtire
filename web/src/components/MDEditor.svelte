<script>
    import {onMount, onDestroy, createEventDispatcher} from "svelte";

    let editorContainer; // Container for the editor
    let editorInstance; // Toast UI Editor instance
    export let genai = null;

    export let md = ""; // Markdown string as a prop
    const dispatch = createEventDispatcher(); // Used for emitting events like `update`
    let isLoading = false;

    async function generateDocumentation() {
        if (genai) {
            isLoading = true;
            try {
                await genai();
            } catch (error) {
                console.error("GenAI call Failed:", error);
            } finally {
                isLoading = false;
            }
        }
    }

    // Import Toast UI Editor dynamically
    onMount(async () => {
        const {Editor} = await import("@toast-ui/editor");
        import("@toast-ui/editor/dist/toastui-editor.css"); // Toast UI CSS

        // Initialize Toast UI Editor
        editorInstance = new Editor({
            el: editorContainer,
            initialValue: md || "",
            initialEditType: "markdown", // Can be "markdown" or "wysiwyg"
            previewStyle: "vertical", // Can also be "tab" or "horizontal"
            height: "500px",
            toolbarItems: [
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
                ['table', 'image', 'link'],
                ['code', 'codeblock'],
                // Using Option: Customize the last button
                [{
                    el: createCustomButton(),
                    command: 'bold',
                    className: "toastui-editor-custom-clear", // for styling
                    tooltip: "Clear all content",
                }]
            ],
            events: {
                change: () => {
                    // Emit the updated content as Markdown
                    const value = editorInstance.getMarkdown();
                    dispatch("update", value);
                }
            },
        });
    });

    // Cleanup on component destroy
    onDestroy(() => {
        if (editorInstance) {
            editorInstance.destroy();
            editorInstance = null;
        }
    });

    // Reactive updates to ensure `md` prop updates editor value

    $: if (editorInstance) {
        if (md !== editorInstance.getMarkdown()) {
            editorInstance.setMarkdown(md);
        }
    }

    function createCustomButton(label) {
        const button = document.createElement("div");
        button.textContent = label;
        button.classList.add("ailtire-genai");
        button.style.cursor = "pointer";
        button.addEventListener("click", async () => {
            if (!isLoading) {
                isLoading = true;
                button.classList.remove("ailtire-genai");
                button.classList.add("loading");
                button.disabled = true;

                try {
                    await generateDocumentation();
                } catch (error) {
                    console.error("Error generating documentation:", error);
                } finally {
                    isLoading = false;
                    button.classList.add("ailtire-genai");
                    button.classList.remove("loading");
                    button.disabled = false;
                }
            }
        });
        return button;
    }

</script>

<!-- The container where the editor will be rendered -->
<div bind:this={editorContainer}></div>

<style>
    /* (Optional) To adjust the Toast UI Editor styling */
    div {
        margin-top: 20px;
    }
    .loading {
        display: flex;
        justify-content: center;
    }
    .loading::after {
        content: "";
        width: 20px;
        height: 20px;
        border: 10px solid #dddddd;
        border-top-color: #00ff00;
        border-bottom-color: #00ff00;
        border-radius: 50%;
        transform: rotate(0deg);
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>