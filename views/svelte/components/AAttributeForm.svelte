<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let field: {
    name: string;
    label?: string;
    type: string;
    required?: boolean;
    node?: any;
  };

  // parent’s record: we’ll bind record[field.name]
  export let record: Record<string, any>;

  // optional UI overrides for this one field
  export let overrides: {
    component?: any;
    props?: Record<string, any>;
    placeholder?: string;
    help?: string;
  } = {};

  // any validation error for this field
  export let error: string | null = null;

  const dispatch = createEventDispatcher();

  function onChange() {
    dispatch('change', { name: field.name, value: record[field.name] });
  }
</script>

<div class="field">
  <label for={field.name}>
    {field.label ?? field.name}
    {#if field.required}<span class="req">*</span>{/if}
  </label>

  {#if overrides.component}
    <svelte:component
      this={overrides.component}
      bind:value={record[field.name]}
      {...(overrides.props || {})}
      on:change={onChange} />
  {:else if field.type === 'boolean'}
    <input
      id={field.name}
      type="checkbox"
      bind:checked={record[field.name]}
      on:change={onChange} />

  {:else if field.type === 'number'}
    <input
      id={field.name}
      type="number"
      bind:value={record[field.name]}
      placeholder={overrides.placeholder || ''}
      on:input={onChange} />

  {:else if field.type === 'date'}
    <input
      id={field.name}
      type="date"
      bind:value={record[field.name]}
      placeholder={overrides.placeholder || ''}
      on:input={onChange} />

  {:else if field.type === 'enum' && Array.isArray(field.node?.enum)}
    <select
      id={field.name}
      bind:value={record[field.name]}
      on:change={onChange}>
      {#each field.node.enum as opt}
        <option value={opt}>{opt}</option>
      {/each}
    </select>

  {:else}
    <input
      id={field.name}
      type="text"
      bind:value={record[field.name]}
      placeholder={overrides.placeholder || ''}
      on:input={onChange} />
  {/if}

  {#if overrides.help}
    <div class="help">{overrides.help}</div>
  {/if}

  {#if error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .field { display: grid; gap: 4px; margin-bottom: 12px; }
  label { font-size: 0.9rem; color: #444; }
  .req { color: #b00; margin-left: 4px; }
  input, select { padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
  .help { font-size: 0.8rem; color: #666; }
  .error { font-size: 0.8rem; color: #b00; }
</style>
