<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let pkg: string;
  export let sourceModel: string;
  export let sourceId: string | undefined;
  export let assoc: {
    name: string;
    target: string;
    cardinality: { min: number; max: number | 'n' };
    composition?: boolean;
    owner?: boolean;
    ui?: { display?: string; label?: string; hidden?: boolean };
    via?: { addOp?: string; removeOp?: string };
  };

  export let state: {
    linked: any[];
    loading: boolean;
    q: string;
    results: any[];
    searching: boolean;
  };

  const dispatch = createEventDispatcher();

  // Derived flags
  const isOne      = assoc.cardinality.max === 1;
  const isMany     = !isOne;
  const isOwned    = !!(assoc.composition || assoc.owner);
  const canRead    = !!sourceId;
  const canLink    = isMany || (isOne && !isOwned);
  const canReplace = isOne;
  const canUnlink  = true;          // both 1:1 and 1:n allow removal
  const canCreate  = isOwned;        // only if ownership/composition
  const canDestroy = isOwned;        // only if ownership/composition

  const displayKey = assoc.ui?.display ?? 'name';
  const showName   = (x: any) => x?.[displayKey] ?? x?.id ?? '(unnamed)';

  function doLink(item)   { dispatch('link',    { assoc, item }); }
  function doUnlink(item) { dispatch('unlink',  { assoc, item }); }
  function doCreate()     { dispatch('create',  assoc); }
  function doDestroy(item){ dispatch('destroy', { assoc, item }); }
  function onSearchInput(e) {
    state.q = e.currentTarget.value;
    dispatch('search', assoc);
  }
</script>

{#if !assoc.ui?.hidden}
<div class="assoc-field">
  <label>{assoc.ui?.label ?? assoc.name} → {assoc.target}</label>

  {#if isOne}
    {#if isOwned}
      <!-- 1:1 owned -->
      <div class="row">
        <input readonly class="ro"
               value={state.linked[0] ? showName(state.linked[0]) : '(none)'} />

        {#if canCreate}
          <button on:click={doCreate}>
            {state.linked[0] ? 'Replace' : 'Create'}
          </button>
        {/if}

        {#if canDestroy && state.linked[0]}
          <button class="danger" on:click={() => doDestroy(state.linked[0])}>
            Destroy
          </button>
        {/if}
      </div>

    {:else}
      <!-- 1:1 reference -->
      <div class="lookup">
        <input placeholder="Search…" bind:value={state.q} on:input={onSearchInput}/>
        <div class="results" aria-busy={state.searching}>
          {#each state.results as item}
            <div class="row">
              <span>{showName(item)}</span>
              {#if canReplace}
                <button on:click={() => doLink(item)}>
                  {(state.linked[0]?.id === item.id) ? 'Selected' : 'Select'}
                </button>
              {/if}
            </div>
          {/each}
        </div>
        {#if state.linked[0]}
          <div class="current">
            Current: {showName(state.linked[0])}
            {#if canUnlink}
              <button class="danger" on:click={() => doUnlink(state.linked[0])}>
                Clear
              </button>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

  {:else}
    <!-- MANY -->
    <div class="many">
      <div class="list" aria-busy={state.loading}>
        {#each state.linked as item}
          <div class="row">
            <span>{showName(item)}</span>
            {#if canUnlink}
              <button on:click={() => doUnlink(item)}>Remove</button>
            {/if}
            {#if canDestroy}
              <button class="danger" on:click={() => doDestroy(item)}>Destroy</button>
            {/if}
          </div>
        {/each}
        {#if !state.linked.length}
          <div class="empty">No items</div>
        {/if}
      </div>

      <div class="actions-row">
        {#if canLink}
          <div class="picker">
            <input placeholder="Search to add…" bind:value={state.q} on:input={onSearchInput}/>
            <div class="results" aria-busy={state.searching}>
              {#each state.results as item}
                <div class="row">
                  <span>{showName(item)}</span>
                  <button on:click={() => doLink(item)}>Add</button>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if canCreate}
          <button on:click={doCreate}>Create & Add</button>
        {/if}
      </div>
    </div>
  {/if}
</div>
{/if}

<style>
    .assoc { border:1px dashed #ccc; border-radius:8px; padding:10px; margin-bottom:12px; display:grid; gap:8px; }
    .row { display:flex; justify-content:space-between; gap:8px; }
    .list, .results { display:grid; gap:4px; max-height:180px; overflow:auto; border:1px solid #ddd; border-radius:6px; padding:6px; }
    .modal { position:fixed; inset:0; background:rgba(0,0,0,.3); display:grid; place-items:center; }
    .modal > :global(*) { background:white; padding:16px; border-radius:10px; width:min(700px,90vw); }
    .danger { color:#b00020; }
</style>
