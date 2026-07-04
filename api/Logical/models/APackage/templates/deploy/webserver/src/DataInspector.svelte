<script>
  import { summarizeItem } from './modelStore.js';

  export let store = null;
  export let title = 'Records';
  export let description = '';

  let currentStore = null;
  let searchText = '';
  let draftText = '';
  let parseError = '';
  let lastSelectedId = null;

  $: state = store ? $store : {
    items: [],
    selectedId: null,
    selectedItem: null,
    draft: null,
    loading: false,
    saving: false,
    error: null,
    dirty: false,
    capabilities: { create: false, update: false, remove: false }
  };

  $: if (store && store !== currentStore) {
    currentStore = store;
    parseError = '';
    searchText = '';
    store.loadAll?.();
  }

  $: if (state?.selectedId !== lastSelectedId) {
    lastSelectedId = state?.selectedId || null;
    const source = state?.draft || state?.selectedItem || null;
    draftText = source ? JSON.stringify(source, null, 2) : '{\n}\n';
  }

  $: filteredItems = (state?.items || []).filter((item) => {
    const term = searchText.trim().toLowerCase();
    if (!term) {
      return true;
    }
    const haystack = [item?.name, item?.title, item?.email, item?.id, JSON.stringify(item)].join(' ').toLowerCase();
    return haystack.includes(term);
  });

  function selectItem(item) {
    parseError = '';
    store?.select?.(item);
  }

  function startNew() {
    parseError = '';
    store?.clearSelection?.();
    draftText = '{\n  \n}';
  }

  async function saveDraft() {
    parseError = '';
    let parsed;
    try {
      parsed = draftText ? JSON.parse(draftText) : {};
    } catch (error) {
      parseError = error?.message || 'Invalid JSON.';
      return;
    }

    if (!store?.saveDraft) {
      parseError = 'This store does not support generic save.';
      return;
    }

    try {
      await store.saveDraft(parsed);
    } catch (error) {
      parseError = error?.message || 'Unable to save record.';
    }
  }

  async function refreshSelected() {
    parseError = '';
    try {
      await store?.refresh?.();
    } catch (error) {
      parseError = error?.message || 'Unable to refresh record.';
    }
  }

  async function reloadList() {
    parseError = '';
    try {
      await store?.loadAll?.();
    } catch (error) {
      parseError = error?.message || 'Unable to load list.';
    }
  }

  async function deleteSelected() {
    parseError = '';
    if (!state?.selectedId || !store?.remove) {
      return;
    }
    try {
      await store.remove(state.selectedId);
    } catch (error) {
      parseError = error?.message || 'Unable to delete record.';
    }
  }
</script>

<section class="inspector">
  <header class="inspector-header">
    <div>
      <div class="eyebrow">Data</div>
      <h3>{title}</h3>
      {#if description}
        <p>{description}</p>
      {/if}
    </div>

    <div class="actions">
      <button type="button" on:click={reloadList} disabled={state.loading}>Reload</button>
      <button type="button" on:click={startNew}>New</button>
      <button type="button" on:click={refreshSelected} disabled={!state.selectedId}>Refresh</button>
      <button type="button" class="danger" on:click={deleteSelected} disabled={!state.selectedId || !state.capabilities?.remove}>Delete</button>
    </div>
  </header>

  <div class="layout">
    <aside class="list-pane">
      <label class="search">
        <span>Filter</span>
        <input bind:value={searchText} type="search" placeholder="Search records" />
      </label>

      {#if state.loading && filteredItems.length === 0}
        <div class="empty">Loading records...</div>
      {:else if filteredItems.length === 0}
        <div class="empty">No records found.</div>
      {:else}
        <div class="records">
          {#each filteredItems as item}
            <button
              type="button"
              class:selected={item.id === state.selectedId}
              on:click={() => selectItem(item)}
            >
              <span class="record-title">{summarizeItem(item)}</span>
              <span class="record-meta">{item.id || item.name || 'record'}</span>
            </button>
          {/each}
        </div>
      {/if}
    </aside>

    <section class="detail-pane">
      <div class="detail-header">
        <div>
          <div class="eyebrow">Selected</div>
          <h4>{state.selectedItem ? summarizeItem(state.selectedItem) : 'None'}</h4>
          <p>{state.selectedId || 'No record selected'}</p>
        </div>
        <div class="detail-state">
          {#if state.loading}<span>Loading</span>{/if}
          {#if state.saving}<span>Saving</span>{/if}
          {#if state.dirty}<span>Dirty</span>{/if}
        </div>
      </div>

      <label class="editor">
        <span>Record JSON</span>
        <textarea bind:value={draftText} spellcheck="false" rows="22"></textarea>
      </label>

      {#if parseError || state.error}
        <p class="error">{parseError || state.error}</p>
      {/if}

      <div class="footer-actions">
        <button type="button" class="primary" on:click={saveDraft} disabled={state.saving || (!state.capabilities?.update && !state.capabilities?.create)}>
          {#if state.selectedId}
            Update Record
          {:else}
            Create Record
          {/if}
        </button>
      </div>
    </section>
  </div>
</section>

<style>
  .inspector {
    display: grid;
    gap: 14px;
  }

  .inspector-header {
    align-items: start;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }

  .inspector-header h3,
  .detail-header h4 {
    margin: 0;
  }

  .inspector-header p,
  .detail-header p {
    color: #6b7280;
    margin: 0;
  }

  .eyebrow {
    color: #6b7280;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .actions,
  .footer-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .layout {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
    min-width: 0;
  }

  .list-pane,
  .detail-pane {
    min-width: 0;
  }

  .search {
    display: grid;
    gap: 6px;
    margin-bottom: 12px;
  }

  .search span,
  .editor span {
    color: #4b5563;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .search input,
  textarea {
    border: 1px solid #d3d8e0;
    border-radius: 6px;
    font: inherit;
    padding: 10px 12px;
  }

  .records {
    display: grid;
    gap: 8px;
    max-height: 560px;
    overflow: auto;
  }

  .records button,
  .actions button,
  .footer-actions button {
    background: #fff;
    border: 1px solid #d7dce3;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
    padding: 10px 12px;
  }

  .records button {
    display: grid;
    gap: 2px;
    text-align: left;
  }

  .records button.selected {
    border-color: #1f2937;
    box-shadow: inset 0 0 0 1px #1f2937;
  }

  .record-title {
    font-weight: 700;
  }

  .record-meta {
    color: #6b7280;
    font-size: 0.82rem;
    overflow-wrap: anywhere;
  }

  .detail-pane {
    display: grid;
    gap: 12px;
  }

  .detail-header {
    align-items: start;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .detail-state {
    color: #4b5563;
    display: flex;
    gap: 10px;
    font-size: 0.85rem;
  }

  textarea {
    min-height: 460px;
    resize: vertical;
    width: 100%;
  }

  .error {
    color: #b00020;
    margin: 0;
  }

  .empty {
    color: #6b7280;
    padding: 12px 0;
  }

  .danger {
    border-color: #d4a0a0 !important;
    color: #a11d1d;
  }

  .primary {
    background: #1f2937;
    border-color: #1f2937;
    color: #fff;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 960px) {
    .inspector-header,
    .detail-header {
      flex-direction: column;
    }

    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
