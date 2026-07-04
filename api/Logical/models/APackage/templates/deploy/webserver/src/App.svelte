<script>
  import { onMount } from 'svelte';
  import DataInspector from './DataInspector.svelte';
  import { createModelStore } from './modelStore.js';

  const modelModules = import.meta.glob('../../../../models/**/views/svelte/index.js', { eager: true });
  const apiTarget = import.meta.env.VITE_API_TARGET || 'http://localhost:3000';

  function getModelName(filePath) {
    const parts = filePath.replaceAll('\\', '/').split('/');
    const modelIndex = parts.lastIndexOf('models');
    return modelIndex >= 0 && parts[modelIndex + 1] ? parts[modelIndex + 1] : filePath;
  }

  function toExportEntry(name, component) {
    return component ? { name, component } : null;
  }

  function findStoreExport(mod) {
    const candidates = Object.entries(mod).filter(([name, value]) => /Store$/i.test(name) && value && typeof value === 'object');
    for (const [name, value] of candidates) {
      if (typeof value.subscribe === 'function') {
        return { name, store: value };
      }
    }

    if (mod.store && typeof mod.store.subscribe === 'function') {
      return { name: 'store', store: mod.store };
    }

    if (mod.default?.store && typeof mod.default.store.subscribe === 'function') {
      return { name: 'store', store: mod.default.store };
    }

    return null;
  }

  const models = Object.entries(modelModules).map(([file, mod]) => {
    const model = getModelName(file);
    const exports = [
      toExportEntry('Browser', mod.Browser || mod.default?.Browser),
      toExportEntry('List', mod.List || mod.default?.List),
      toExportEntry('Form', mod.Form || mod.default?.Form),
      toExportEntry('Detail', mod.Detail || mod.default?.Detail)
    ].filter(Boolean);

    const storeExport = findStoreExport(mod);
    const storePath = storeExport?.store?.path || model.toLowerCase();
    const dataStore = createModelStore({ path: storePath });
    const views = [...exports, { name: 'Data', kind: 'data' }];

    return {
      key: model,
      model,
      file,
      exports,
      views,
      storeExport,
      storePath,
      dataStore,
      selectedView: exports[0]?.name || 'Data'
    };
  }).filter((entry) => entry.views.length > 0);

  let selectedModelKey = models[0]?.key || null;
  let selectedViewName = models[0]?.selectedView || 'Data';
  let filterText = '';

  const filteredModels = () => {
    const term = filterText.trim().toLowerCase();
    if (!term) {
      return models;
    }
    return models.filter((entry) => entry.model.toLowerCase().includes(term));
  };

  function setSelection(model) {
    selectedModelKey = model.key;
    selectedViewName = model.selectedView || 'Data';
  }

  function setView(model, viewName) {
    selectedModelKey = model.key;
    selectedViewName = viewName;
  }

  onMount(() => {
    if (!selectedModelKey && models.length > 0) {
      setSelection(models[0]);
    }
  });

  $: activeModel = models.find((entry) => entry.key === selectedModelKey) || models[0] || null;
  $: activeViews = activeModel?.views || [];
  $: activeView = activeViews.find((entry) => entry.name === selectedViewName) || activeViews[0] || null;
  $: renderedComponent = activeView?.component || null;
  $: isDataView = activeView?.kind === 'data' || activeView?.name === 'Data';
</script>

<main class="workspace">
  <header class="topbar">
    <div class="titleblock">
      <div class="eyebrow">Micro UI Harness</div>
      <h1><%= name %></h1>
      <p>
        Render model browsers and their micro-components in isolation while the web server proxies API calls to
        <code>{apiTarget}</code>.
      </p>
    </div>
    <div class="meta">
      <span>{models.length} models discovered</span>
      <span>{filteredModels().length} visible</span>
    </div>
  </header>

  <section class="controls">
    <label class="search">
      <span>Filter</span>
      <input bind:value={filterText} type="search" placeholder="Search models" />
    </label>
  </section>

  <div class="layout">
    <aside class="sidebar">
      {#each filteredModels() as model}
        <button
          type="button"
          class:selected={model.key === selectedModelKey}
          on:click={() => setSelection(model)}
        >
          <span class="model-name">{model.model}</span>
          <span class="model-file">{model.views.length} views</span>
        </button>
      {:else}
        <div class="empty">No browser components found.</div>
      {/each}
    </aside>

    <section class="viewer">
      {#if activeModel}
        <div class="viewer-header">
          <div>
            <h2>{activeModel.model}</h2>
            <p>{activeModel.file}</p>
            <p class="store-path">Store path: <code>{activeModel.storePath}</code></p>
          </div>
          <div class="mode-tabs">
            {#each activeViews as entry}
              <button
                type="button"
                class:selected={entry.name === selectedViewName}
                on:click={() => setView(activeModel, entry.name)}
              >
                {entry.name}
              </button>
            {/each}
          </div>
        </div>

        <div class="panel">
          {#if isDataView}
            <DataInspector
              store={activeModel.dataStore}
              title={activeModel.model}
              description={`Generic record inspector for ${activeModel.model}.`}
            />
          {:else if renderedComponent}
            <svelte:component this={renderedComponent} />
          {:else}
            <div class="empty">No component selected.</div>
          {/if}
        </div>
      {:else}
        <div class="empty">No model views available.</div>
      {/if}
    </section>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #f5f6f8;
    color: #1f2328;
  }

  .workspace {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 20px;
    width: 100%;
  }

  .topbar {
    align-items: end;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .eyebrow {
    color: #6b7280;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  h1 {
    font-size: 1.6rem;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .titleblock p {
    color: #525866;
    max-width: 72ch;
  }

  .meta {
    color: #525866;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-end;
    text-align: right;
  }

  .controls {
    margin-bottom: 14px;
  }

  .search {
    align-items: start;
    display: grid;
    gap: 6px;
    max-width: 360px;
  }

  .search span {
    color: #4b5563;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .search input {
    border: 1px solid #d3d8e0;
    border-radius: 6px;
    font: inherit;
    padding: 10px 12px;
  }

  .layout {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
    min-height: calc(100vh - 160px);
  }

  .sidebar,
  .viewer,
  .panel {
    min-width: 0;
  }

  .sidebar {
    display: grid;
    gap: 8px;
    align-content: start;
    overflow: auto;
  }

  .sidebar button,
  .mode-tabs button {
    background: #fff;
    border: 1px solid #d7dce3;
    border-radius: 6px;
    cursor: pointer;
    display: grid;
    gap: 2px;
    font: inherit;
    padding: 10px 12px;
    text-align: left;
  }

  .sidebar button.selected,
  .mode-tabs button.selected {
    border-color: #1f2937;
    box-shadow: inset 0 0 0 1px #1f2937;
  }

  .model-name {
    font-weight: 700;
  }

  .model-file,
  .store-path {
    color: #6b7280;
    font-size: 0.82rem;
    overflow-wrap: anywhere;
  }

  .viewer {
    display: grid;
    gap: 12px;
    align-content: start;
  }

  .viewer-header {
    align-items: start;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }

  .viewer-header h2 {
    font-size: 1.1rem;
    margin-bottom: 4px;
  }

  .viewer-header p {
    color: #6b7280;
    font-size: 0.88rem;
  }

  .mode-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
  }

  .panel {
    background: #fff;
    border: 1px solid #d7dce3;
    border-radius: 6px;
    min-height: 640px;
    overflow: auto;
    padding: 16px;
  }

  .empty {
    color: #6b7280;
    padding: 16px;
  }

  code {
    background: #eef2f7;
    border-radius: 4px;
    padding: 0 4px;
  }

  @media (max-width: 960px) {
    .topbar,
    .viewer-header {
      flex-direction: column;
      align-items: start;
    }

    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
