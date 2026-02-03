<script lang="ts">
    export type DocumentStatus = 'idle' | 'uploading' | 'converting' | 'ready' | 'error';

    export interface LoadedDocument {
        id: string;
        name: string;
        sizeBytes?: number;
        status: DocumentStatus;
        progress?: number; // 0–100
        errorMessage?: string;
    }

    export let documents: LoadedDocument[] = [];
    export let onRemove: (id: string) => void;
    export let onClickDocument: (doc: LoadedDocument) => void = () => {};

    const formatSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const statusLabel = (status: DocumentStatus) => {
        switch (status) {
            case 'uploading':
                return 'Uploading…';
            case 'converting':
                return 'Converting…';
            case 'ready':
                return 'Ready';
            case 'error':
                return 'Error';
            default:
                return '';
        }
    };
    const tileStatusClasses = (status: DocumentStatus) => {
        switch (status) {
            case 'uploading': return 'bg-blue-100 text-blue-800';
            case 'converting': return 'bg-yellow-100 text-yellow-800';
            case 'ready': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
</script>

<div class="flex flex-wrap gap-2 mb-3">
    {#if documents.length === 0}
        <div class="text-sm text-gray-400">
        </div>
    {:else}
        {#each documents as doc}
            <a
                    type="button"
                    class={`relative group flex items-stretch gap-2 min-w-[50px] max-w-[100px] max-h-[50px] min-h-[50px] px-3 py-2 rounded-md border text-left
                       bg-white/80 backdrop-blur
                       hover:border-blue-500 hover:bg-blue-50
                       transition-colors
                       disabled:opacity-70 overflow-hidden ${tileStatusClasses(doc.status)}`}
                    title="{doc.name} - {doc.sizeBytes ? formatSize(doc.sizeBytes) : statusLabel(doc.status)}"
                    on:click={() => onClickDocument(doc)}
            >
                <!-- Left: status dot / spinner -->

                <!-- Middle: name + status -->
                <div class="flex-1 min-w-0">

                    <div class="text-xs font-medium text-gray-900 truncate">
                        {doc.name}
                    </div>
                    <div class="flex items-center gap-1 text-[11px] text-gray-500">
                        <span>{statusLabel(doc.status)}</span>
                        {#if doc.progress != null && (doc.status === 'uploading' || doc.status === 'converting')}
                            <span>· {doc.progress}%</span>
                        {/if}
                        {#if doc.sizeBytes}
                            <span>{formatSize(doc.sizeBytes)}</span>
                        {/if}
                    </div>

                    <!-- Progress bar -->
                    {#if doc.progress != null && (doc.status === 'uploading' || doc.status === 'converting')}
                        <div class="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                    class="h-full bg-blue-500 transition-[width]"
                                    style={`width: ${doc.progress}%;`}
                            />
                        </div>
                    {/if}

                    <!-- Error message preview -->
                    {#if doc.status === 'error' && doc.errorMessage}
                        <div class="text-[11px] text-red-500 line-clamp-1">
                            {doc.errorMessage}
                        </div>
                    {/if}
                </div>

                <!-- Right: remove button -->
                <button
                        type="button"
                        class="absolute top-1 right-1 text-[10px] px-1 text-gray-400 hover:text-gray-600"
                        on:click|stopPropagation={() => onRemove(doc.id)}
                        aria-label="Remove document"
                        title="Remove document"
                >
                    ✕
                </button>
            </a>
        {/each}
    {/if}
</div>