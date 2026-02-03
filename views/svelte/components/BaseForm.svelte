<script lang="ts">
    import AttributeForm from "./AAttributeForm.svelte";
    import AssociationForm from "./AAssociationForm.svelte";

    export let pkg;
    export let model;
    import {createEventDispatcher, onMount} from 'svelte';

    // Props from parent:
    export let pkg!: string;
    export let model!: string;
    export let id: string | undefined = undefined;
    export let title: string = '';
    export let autosave: boolean = false;

    // Either JSON Schema (preferred) or null
    export let schema: any = null;
    // ModelManifest defining attributes + associations
    export let manifest: any = null;

    // Starting values and overrides
    export let value: Record<string, any> = {};
    export let overrides: Record<string, any> = {};

    const dispatch = createEventDispatcher();

    // Internal working state:
    let record: Record<string, any> = {};
    let errors: Record<string, string> = {};
    let submitting = false;

    // Association caches:
    let assocState: Record<string, any> = {};

    onMount(async () => {
        // initialize record from value or, when editing, fetch full record
        record = structuredClone(value);
        if (id && (api as any)?.get) {
            try {
                record = await api().get(pkg, model, id);
            } catch {
            }
        }

        // initialize assocState
        for (const iface of manifest.interfaces ?? []) {
            for (const a of iface.associations ?? []) {
                assocState[a.name] = {linked: [], loading: false, q: '', results: [], searching: false};
                if (id) loadLinked(a);
            }
        }
    });

    async function loadLinked(a: any) {
        assocState[a.name].loading = true;
        try {
            const src = await api().get(pkg, model, id!);
            const v = src[a.name];
            assocState[a.name].linked = Array.isArray(v) ? v : v ? [v] : [];
        } finally {
            assocState[a.name].loading = false;
        }
    }

    function reset() {
        record = structuredClone(value);
        errors = {};
        // optionally clear assocState here too
    }

    function cancel() {
        dispatch('cancel');
    }

    function validate(): boolean {
        errors = {};
        // simple required-field check via manifest
        for (const iface of manifest.interfaces ?? []) {
            for (const attr of iface.attributes ?? []) {
                if (attr.required && (record[attr.name] == null || record[attr.name] === '')) {
                    errors[attr.name] = 'Required';
                }
            }
        }
        return Object.keys(errors).length === 0;
    }

    async function submit() {
        if (!validate()) return;

        dispatch('saving'); // optional intermediate event

        if (!autosave) {
            return dispatch('save', record);
        }

        submitting = true;
        try {
            const client = api();
            const saved = id
                ? await client.update(pkg, model, id, record)
                : await client.create(pkg, model, record);

            dispatch('save', saved);
        } catch (e) {
            console.error(e);
            dispatch('error', e);
        } finally {
            submitting = false;
        }
    }
</script>

<div class="baseform">
    {#if title}
        <h2 class="title">{title}</h2>
    {/if}

    <form on:submit|preventDefault={submit}>
        <!-- ATTRIBUTES -->
        {#each manifest.interfaces.flatMap(i => i.attributes ?? []) as f}
            <AttributeForm
                    {f}
                    bind:record
                    error={errors[f.name]}
                    overrides={overrides[f.name] ?? {}}
                    on:change={() => {/* nothing: record is already bound */}}/>
        {/each}

        <!-- ASSOCIATIONS -->
        {#each manifest.interfaces.flatMap(i => i.associations ?? []) as assoc}
            <AssociationForm
                    {pkg}
                    sourceModel={model}
                    sourceId={id}
                    {assoc}
                    state={assocState[assoc.name]}
                    on:link={(e) => {/* e.detail contains {assoc, target} */}}
                    on:unlink={(e) => {}}
                    on:create={(e) => {}}
                    on:destroy={(e) => {}}/>
        {/each}

        <!-- ACTIONS -->
        <div class="actions">
            <button type="button" class="tertiary" on:click={() => { reset(); dispatch('reset'); }}
                    disabled={submitting}>
                Reset
            </button>
            <button type="button" class="secondary" on:click={cancel} disabled={submitting}>
                Cancel
            </button>
            <button type="submit" class="primary" disabled={submitting}>
                {id ? 'Save' : 'Create'}
            </button>
        </div>
    </form>
</div>

<style>
    .baseform {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #fff;
        max-width: 800px;
        margin: auto;
    }

    .title {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        color: #333;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    button.primary {
        background: #2f7df4;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }

    button.secondary {
        background: transparent;
        border: 1px solid #888;
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }

    button.tertiary {
        background: transparent;
        border: none;
        color: #555;
        padding: 0.5rem 1rem;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
