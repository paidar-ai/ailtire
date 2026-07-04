const fs = require('fs');
const path = require('path');

const RESERVED_MODEL_FILES = new Set([
    'index.js',
    'construct.js',
    'generate.js',
    'generateattributes.js',
    'generatemethods.js',
    'generatedocumentation.js',
    'generatedescription.js',
    'generateassociations.js',
    'generatestatenet.js',
    'generateview.js',
]);

const RESERVED_STANDARD_ACTIONS = new Set([
    'create',
    'get',
    'list',
    'update',
    'remove',
    'delete',
    'save',
    'find',
    'set',
]);

module.exports = {
    friendlyName: 'generateView',
    description: 'Generate a view surface for a model',
    static: true,
    inputs: {
        id: {
            description: 'The id of the model',
            type: 'string',
            required: true,
        },
        type: {
            description: 'The view type to generate',
            type: 'string',
            required: false,
        },
    },

    exits: {
        json: (obj) => obj,
    },

    fn: async function (inputs) {
        const className = inputs.id || this?.definition?.name || this?.name;
        const type = inputs.type || 'svelte';
        const cls = _getClass(className, this);
        if (!cls) {
            throw new Error(`Could not find the Class: ${className}`);
        }
        if (String(type).toLowerCase() !== 'svelte') {
            throw new Error(`Unsupported view type: ${type}`);
        }
        return generateView(cls);
    },
};

function generateView(cls) {
    const spec = buildSpec(cls);
    const sourceMTime = maxMTime(spec.sourceFiles);
    const outputs = {
        [path.join(spec.viewDir, 'index.js')]: renderIndex(spec),
        [path.join(spec.viewDir, `${spec.storeName}.js`)]: renderStore(spec),
        [path.join(spec.viewDir, 'Browser.svelte')]: renderBrowser(spec),
        [path.join(spec.viewDir, 'List.svelte')]: renderList(spec),
        [path.join(spec.viewDir, 'Form.svelte')]: renderForm(spec),
        [path.join(spec.viewDir, 'Detail.svelte')]: renderDetail(spec),
    };

    const results = {};
    for (const [file, content] of Object.entries(outputs)) {
        results[file] = writeGeneratedFile(file, content, sourceMTime);
    }

    return {
        model: spec.modelName,
        routeBase: spec.routeBase,
        viewDir: spec.viewDir,
        sourceMTime,
        results,
    };
}

function buildSpec(cls) {
    const modelName = cls.definition.name;
    const routeBase = getPackageRouteBase(cls);
    const modelDir = cls.definition.dir;
    const viewDir = path.join(modelDir, 'views', 'svelte');
    const interfaceDir = getInterfaceSourceDir(cls, routeBase);
    const modelActionFiles = getModelActionFiles(modelDir);
    const interfaceActionFiles = getActionFiles(interfaceDir);
    const sourceFiles = [
        path.join(modelDir, 'index.js'),
        ...modelActionFiles,
        ...interfaceActionFiles,
    ];
    const actionNames = getActionNames([...modelActionFiles, ...interfaceActionFiles]);
    const attributes = Object.entries(cls.definition.attributes || {}).map(([name, def]) => ({
        name,
        type: def?.type || 'string',
        description: def?.description || '',
        file: def?.file || null,
        encoding: def?.encoding || null,
        storage: def?.storage || null,
    }));
    const associations = Object.entries(cls.definition.associations || {}).map(([name, def]) => ({
        name,
        type: def?.type || 'object',
        description: def?.description || '',
        cardinality: def?.cardinality === 'n' || def?.cardinality === 'N' || def?.cardinality > 1 ? 'n' : 1,
        composition: Boolean(def?.composition),
        owner: Boolean(def?.owner),
        via: def?.via || null,
        service: def?.service || null,
    }));
    const primaryField = getPrimaryField(attributes);
    const summaryFields = getAttributeSummaryFields(attributes, primaryField);
    const previewField = getPreviewField(attributes);
    const customActions = actionNames.filter((name) => !RESERVED_STANDARD_ACTIONS.has(name.toLowerCase()));
    const operationActions = {
        list: pickAction(actionNames, ['list', 'all']),
        get: pickAction(actionNames, ['get', 'find']),
        create: pickAction(actionNames, ['create', 'add', 'new']),
        update: pickAction(actionNames, ['update', 'updateProfile', 'save']),
        remove: pickAction(actionNames, ['remove', 'delete', 'destroy']),
    };

    return {
        modelName,
        modelLower: toLowerId(modelName),
        routeBase,
        modelDir,
        viewDir,
        interfaceDir,
        sourceFiles,
        targetFiles: [
            path.join(viewDir, 'index.js'),
            path.join(viewDir, 'store.js'),
            path.join(viewDir, 'Browser.svelte'),
            path.join(viewDir, 'List.svelte'),
            path.join(viewDir, 'Form.svelte'),
            path.join(viewDir, 'Detail.svelte'),
        ],
        attributes,
        associations,
        actionNames,
        customActions,
        operationActions,
        primaryField,
        summaryFields,
        previewField,
        storeName: 'store',
        storeFile: 'store.js',
        meta: {
            modelName,
            modelLower: toLowerId(modelName),
            routeBase,
            primaryField,
            summaryFields,
            previewField,
            operationActions,
            attributes,
            associations,
            actionNames,
            customActions,
        },
    };
}

function getPackageRef(cls) {
    return cls.package || cls.definition?.package || cls.definition?.pkg || null;
}

function getPackageRouteBase(cls) {
    const pkg = getPackageRef(cls) || {};
    const prefix = String(pkg.prefix || '').trim().replace(/^\/+|\/+$/g, '');
    if (prefix) {
        const parts = prefix.split('/').filter(Boolean);
        if (parts.length) {
            return parts[parts.length - 1].toLowerCase();
        }
    }
    if (pkg.shortname) {
        return toLowerId(pkg.shortname);
    }
    if (pkg.name) {
        return toLowerId(pkg.name);
    }
    return toLowerId(cls.definition?.name || cls.name || 'model');
}

function getInterfaceSourceDir(cls, routeBase) {
    const pkg = getPackageRef(cls) || {};
    const pkgDir = pkg.dir;
    if (!pkgDir) {
        return null;
    }
    const interfaceRoot = path.join(pkgDir, 'interface');
    if (!isDirectory(interfaceRoot)) {
        return null;
    }
    const candidates = [
        routeBase,
        toLowerId(cls.definition?.name),
        toLowerId(pkg.shortname),
    ].filter(Boolean);

    for (const candidate of candidates) {
        const candidateDir = path.join(interfaceRoot, candidate);
        if (isDirectory(candidateDir)) {
            return candidateDir;
        }
    }

    const subdirs = listSubdirs(interfaceRoot);
    if (subdirs.length === 1) {
        return subdirs[0];
    }

    for (const dir of subdirs) {
        const jsFiles = listFiles(dir).filter((file) => file.endsWith('.js'));
        if (jsFiles.length > 0) {
            return dir;
        }
    }

    return null;
}

function getModelActionFiles(modelDir) {
    return listFiles(modelDir)
        .filter((file) => file.endsWith('.js'))
        .filter((file) => !RESERVED_MODEL_FILES.has(path.basename(file).toLowerCase()));
}

function getActionFiles(actionDir) {
    if (!isDirectory(actionDir)) {
        return [];
    }
    return walkJsFiles(actionDir);
}

function getActionNames(files) {
    const names = new Set();
    for (const file of files) {
        const name = basenameNoExt(file);
        if (name && !name.startsWith('_')) {
            names.add(name);
        }
    }
    return [...names].sort((a, b) => a.localeCompare(b));
}

function pickAction(actionNames, candidates, fallback) {
    const lookup = new Map(actionNames.map((name) => [name.toLowerCase(), name]));
    for (const candidate of candidates) {
        if (lookup.has(candidate.toLowerCase())) {
            return lookup.get(candidate.toLowerCase());
        }
    }
    return fallback || candidates[0] || null;
}

function getAttributeSummaryFields(attributes, primaryField) {
    const preferred = ['title', 'email', 'description', 'notes', 'summary', 'status'];
    const names = [];
    for (const name of preferred) {
        if (attributes.some((attr) => attr.name === name && name !== primaryField)) {
            names.push(name);
        }
    }
    for (const attr of attributes) {
        if (attr.name === primaryField || names.includes(attr.name)) {
            continue;
        }
        if (['string', 'text', 'number', 'integer', 'decimal'].includes(attr.type)) {
            names.push(attr.name);
        }
        if (names.length >= 3) {
            break;
        }
    }
    return names.slice(0, 3);
}

function getPrimaryField(attributes) {
    if (attributes.some((attr) => attr.name === 'name')) {
        return 'name';
    }
    if (attributes.length > 0) {
        return attributes[0].name;
    }
    return 'id';
}

function getPreviewField(attributes) {
    const candidates = ['thumbnail', 'image', 'photo', 'avatar', 'picture'];
    for (const candidate of candidates) {
        if (attributes.some((attr) => attr.name === candidate)) {
            return candidate;
        }
    }
    const fileAttr = attributes.find((attr) => attr.type === 'file' || attr.type === 'blob');
    return fileAttr ? fileAttr.name : null;
}

function toLowerId(name) {
    return String(name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function basenameNoExt(file) {
    return path.basename(file, path.extname(file));
}

function isDirectory(source) {
    return typeof source === 'string' && fs.existsSync(source) && fs.lstatSync(source).isDirectory();
}

function isFile(source) {
    return typeof source === 'string' && fs.existsSync(source) && fs.lstatSync(source).isFile();
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function getMTime(file) {
    if (typeof file !== 'string' || !file || !fs.existsSync(file)) {
        return 0;
    }
    return fs.statSync(file).mtimeMs || 0;
}

function maxMTime(files) {
    return files.reduce((max, file) => Math.max(max, getMTime(file)), 0);
}

function listSubdirs(dir) {
    if (!isDirectory(dir)) {
        return [];
    }
    return fs.readdirSync(dir)
        .map((name) => path.join(dir, name))
        .filter(isDirectory);
}

function listFiles(dir) {
    if (!isDirectory(dir)) {
        return [];
    }
    return fs.readdirSync(dir)
        .map((name) => path.join(dir, name))
        .filter(isFile);
}

function walkJsFiles(dir) {
    if (!isDirectory(dir)) {
        return [];
    }
    const items = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            items.push(...walkJsFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            items.push(fullPath);
        }
    }
    return items;
}

function fileTypeToInputType(type) {
    const normalized = String(type || '').toLowerCase();
    if (normalized === 'email') return 'email';
    if (normalized === 'url') return 'url';
    if (normalized === 'number' || normalized === 'integer' || normalized === 'decimal') return 'number';
    if (normalized === 'date') return 'date';
    if (normalized === 'datetime') return 'datetime-local';
    if (normalized === 'boolean' || normalized === 'checkbox') return 'checkbox';
    return 'text';
}

function isRichField(attr) {
    return ['text', 'rich_text', 'large_text', 'json', 'object'].includes(String(attr.type || '').toLowerCase()) ||
        attr.type === 'file' || attr.type === 'blob' ||
        attr.name === 'bio' || attr.name === 'notes' || attr.name === 'description';
}

function quote(value) {
    return JSON.stringify(value);
}

function inferHttpMethod(actionName) {
    const normalized = String(actionName || '').toLowerCase();
    if (normalized.startsWith('get') || normalized.startsWith('list') || normalized.startsWith('find') || normalized.startsWith('search') || normalized.startsWith('random')) {
        return 'get';
    }
    if (normalized.startsWith('delete') || normalized.startsWith('remove')) {
        return 'delete';
    }
    return 'post';
}

function renderIndex(spec) {
    return `import Detail from './Detail.svelte';
import Form from './Form.svelte';
import List from './List.svelte';
import Browser from './Browser.svelte';
    import { store, create${spec.modelName}Store, meta } from './store.js';

    export { Detail, Form, List, Browser, meta, store, create${spec.modelName}Store };

    export default {
        Detail,
        Form,
        List,
        Browser,
        meta,
        store,
        create${spec.modelName}Store,
    };
`;
}

function renderStore(spec) {
    const metaJson = JSON.stringify(spec.meta, null, 2);
    const customActionMethods = spec.actionNames
        .filter((name) => !RESERVED_STANDARD_ACTIONS.has(name.toLowerCase()))
        .map((name) => {
            const routeMethod = inferHttpMethod(name);
            return `    async ${name}(payload = {}) {
        return invoke('${name}', payload, '${routeMethod}');
    }`;
        }).join('\n\n');

    return `import { writable } from 'svelte/store';
import axios from 'axios';

export const meta = ${metaJson};

const apiBase = '/' + meta.routeBase;

function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function normalizeRecord(record) {
    if (!record || typeof record !== 'object') {
        return record;
    }
    return {
        ...record,
        id: record.id || record.name,
    };
}

function createInitialState() {
    return {
        items: [],
        selected: null,
        draft: null,
        loading: false,
        saving: false,
        error: null,
        dirty: false,
    };
}

async function invoke(action, payload = {}, method = 'post') {
    const url = apiBase + '/' + action;
    if (method === 'get') {
        const response = await axios.get(url, { params: payload });
        return response.data;
    }
    if (method === 'delete') {
        const response = await axios.delete(url, { data: payload });
        return response.data;
    }
    const response = await axios[method](url, payload);
    return response.data;
}

export function create${spec.modelName}Store() {
    const { subscribe, update } = writable(createInitialState());
    let currentState = createInitialState();
    subscribe((state) => {
        currentState = state;
    });

    function resolveAction(kind, fallback) {
        return (meta.operationActions && meta.operationActions[kind]) || fallback || kind;
    }

    function setState(patch) {
        update((state) => ({ ...state, ...patch }));
    }

    async function list() {
        setState({ loading: true, error: null });
        try {
            const result = await invoke(resolveAction('list', 'list'), {}, 'get');
            const items = Array.isArray(result) ? result.map(normalizeRecord) : [];
            setState({ items, loading: false });
            return items;
        } catch (error) {
            setState({ loading: false, error });
            throw error;
        }
    }

    async function get(id) {
        if (!id) {
            return null;
        }
        const result = await invoke(resolveAction('get', 'get'), { id }, 'get');
        const record = normalizeRecord(result);
        setState({ selected: record, draft: clone(record), error: null, dirty: false });
        return record;
    }

    function select(record) {
        const next = normalizeRecord(record);
        setState({ selected: next, draft: clone(next), dirty: false, error: null });
        return next;
    }

    function setDraft(patch) {
        update((state) => {
            const draft = { ...(state.draft || {}) };
            const changes = typeof patch === 'function' ? patch(clone(draft)) : patch;
            return {
                ...state,
                draft: {
                    ...draft,
                    ...changes,
                },
                dirty: true,
            };
        });
    }

    async function create(record) {
        const payload = clone(record || currentState.draft) || {};
        setState({ saving: true, error: null });
        try {
            const result = await invoke(resolveAction('create', 'create'), payload, 'post');
            const created = normalizeRecord(result);
            update((state) => ({
                ...state,
                items: [...state.items, created],
                selected: created,
                draft: clone(created),
                saving: false,
                dirty: false,
            }));
            return created;
        } catch (error) {
            setState({ saving: false, error });
            throw error;
        }
    }

    async function updateRecord(record) {
        const payload = clone(record || currentState.draft) || {};
        setState({ saving: true, error: null });
        try {
            const result = await invoke(resolveAction('update', 'update'), payload, 'post');
            const updated = normalizeRecord(result || payload);
            update((state) => ({
                ...state,
                items: state.items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
                selected: updated,
                draft: clone(updated),
                saving: false,
                dirty: false,
            }));
            return updated;
        } catch (error) {
            setState({ saving: false, error });
            throw error;
        }
    }

    async function save(record) {
        const target = record || currentState.draft;
        if (!target) {
            throw new Error('No draft selected');
        }
        if (target.id || target.name) {
            return updateRecord(target);
        }
        return create(target);
    }

    async function remove(id) {
        const currentId = id || currentState.selected?.id;
        if (!currentId) {
            return null;
        }
        setState({ saving: true, error: null });
        try {
            const result = await invoke(resolveAction('remove', 'remove'), { id: currentId }, 'delete');
            update((state) => ({
                ...state,
                items: state.items.filter((item) => item.id !== currentId),
                selected: state.selected?.id === currentId ? null : state.selected,
                draft: state.selected?.id === currentId ? null : state.draft,
                saving: false,
                dirty: false,
            }));
            return result;
        } catch (error) {
            setState({ saving: false, error });
            throw error;
        }
    }

${customActionMethods ? customActionMethods + '\n' : ''}
    async function refresh() {
        await list();
        const selected = currentState.selected;
        if (selected && selected.id) {
            await get(selected.id);
        }
    }

    function resetDraft() {
        update((state) => ({
            ...state,
            draft: clone(state.selected),
            dirty: false,
            error: null,
        }));
    }

    return {
        subscribe,
        list,
        get,
        select,
        setDraft,
        create,
        update: updateRecord,
        save,
        remove,
        refresh,
        resetDraft,
        meta,
${spec.customActions.length ? spec.customActions.map((name) => `        ${name},`).join('\n') + '\n' : ''}
        setState,

        // Ailtire custom extension points
        // AILTIRE_CUSTOM_START
        // AILTIRE_CUSTOM_END
    };
}

export const store = create${spec.modelName}Store();
`;
}

function renderBrowser(spec) {
    const previewHelper = spec.previewField ? `function preview(item) {
        if (!item) return null;
        const value = item['${spec.previewField}'];
        if (!value) return null;
        if (typeof value === 'string' && (value.startsWith('data:') || value.startsWith('http') || value.startsWith('/'))) {
            return value;
        }
        return null;
    }` : '';

    return `<script>
    import { onMount } from 'svelte';
    import Detail from './Detail.svelte';
    import Form from './Form.svelte';
    import List from './List.svelte';
    import { store } from './store.js';

    let editing = false;
    let errorMessage = '';

    $: state = $store;
    $: selected = state.selected;
    $: draft = state.draft;
    $: items = state.items;

    onMount(async () => {
        await store.list();
    });

    function startCreating() {
        errorMessage = '';
        editing = true;
        store.select({ ${spec.primaryField}: '', id: null });
    }

    function startEditing() {
        errorMessage = '';
        editing = true;
        store.setDraft({});
    }

    async function selectItem(event) {
        const item = event.detail || event;
        errorMessage = '';
        await store.select(item);
        editing = false;
    }

    async function saveItem(element) {
        errorMessage = '';
        try {
            await store.save(element);
            editing = false;
        } catch (error) {
            errorMessage = error?.response?.data?.error || error?.message || 'Unable to save item.';
        }
    }

    async function deleteItem() {
        if (!selected?.id) {
            return;
        }
        await store.remove(selected.id);
        editing = false;
    }

${previewHelper ? previewHelper + '\n' : ''}
    // AILTIRE_CUSTOM_START
    // Add custom browser logic here.
    // AILTIRE_CUSTOM_END
</script>

<div class="${spec.modelLower}-browser">
    <section class="list-pane" aria-label="${spec.modelName} list">
        <div class="toolbar">
            <button type="button" class="primary-button" on:click={startCreating}>New ${spec.modelName}</button>
            <button type="button" class="secondary-button" on:click={() => store.list()}>Refresh</button>
        </div>
        <List items={items} selectedId={selected?.id} on:select={selectItem} />
    </section>

    <section class="detail-pane" aria-label="${spec.modelName} details">
        {#if selected || editing}
            <div class="detail-toolbar">
                <h2>{selected?.${spec.primaryField} || 'New ${spec.modelName}'}</h2>
                <div class="toolbar-actions">
                    {#if selected?.id}
                        <button type="button" class="icon-button" aria-label="Edit ${spec.modelName}" on:click={startEditing}>Edit</button>
                        <button type="button" class="icon-button danger" aria-label="Delete ${spec.modelName}" on:click={deleteItem}>Delete</button>
                    {/if}
                </div>
            </div>

            {#if editing}
                <Form element={draft || {}} onSave={saveItem} />
            {:else}
                <Detail element={selected} />
            {/if}

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
        {:else}
            <div class="empty-selection">
                <h2>Select a ${spec.modelLower}</h2>
            </div>
        {/if}
    </section>
</div>

<!-- AILTIRE_CUSTOM_MARKUP_START -->
<!-- Add custom browser markup here. -->
<!-- AILTIRE_CUSTOM_MARKUP_END -->

<style>
    .${spec.modelLower}-browser {
        display: grid;
        grid-template-columns: minmax(280px, 0.9fr) minmax(360px, 1.3fr);
        gap: 24px;
        align-items: start;
        width: 100%;
        min-height: 100%;
    }
    .list-pane, .detail-pane { min-width: 0; }
    .toolbar, .detail-toolbar {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    .toolbar-actions { display: flex; gap: 8px; }
    .primary-button, .secondary-button, .icon-button {
        border: 0;
        border-radius: 6px;
        cursor: pointer;
        font: inherit;
        padding: 9px 12px;
    }
    .primary-button { background: #242424; color: #fff; }
    .secondary-button { background: #f4f4f4; color: #222; }
    .icon-button {
        align-items: center;
        aspect-ratio: 1;
        background: #242424;
        color: #fff;
        display: inline-flex;
        justify-content: center;
        width: 38px;
    }
    .icon-button.danger { background: #8b1d1d; }
    .detail-pane { overflow: auto; max-height: 100%; }
    .error { color: #b00020; margin-top: 12px; }
    .empty-selection {
        background: #fff;
        border: 1px solid #ececec;
        border-radius: 8px;
        padding: 20px;
    }
    @media (max-width: 900px) {
        .${spec.modelLower}-browser { grid-template-columns: 1fr; }
    }
</style>
`;
}

function renderList(spec) {
    const summaryFields = spec.summaryFields;
    const previewField = spec.previewField;
    return `<script>
    import { createEventDispatcher } from 'svelte';
    import { meta } from './store.js';

    export let items = [];
    export let selectedId = null;

    const dispatch = createEventDispatcher();
    let searchText = '';

    function label(item) {
        return item?.[meta.primaryField] || item?.name || item?.id || '(untitled)';
    }

    function matches(item) {
        const query = searchText.trim().toLowerCase();
        if (!query) return true;
        return Object.values(item || {}).some((value) => String(value ?? '').toLowerCase().includes(query));
    }

    function preview(item) {
        if (!item) return null;
        const value = item['${previewField || ''}'];
        if (!value || typeof value !== 'string') return null;
        if (value.startsWith('data:') || value.startsWith('http') || value.startsWith('/')) return value;
        return null;
    }

    $: filteredItems = items.filter(matches);
</script>

<div class="${spec.modelLower}-list">
    <div class="search-wrap">
        <input
            type="search"
            bind:value={searchText}
            placeholder="Search ${spec.modelLower}s"
            aria-label="Search ${spec.modelLower}s"
        />
    </div>

    {#if filteredItems.length > 0}
        <ul>
            {#each filteredItems as item}
                <li>
                    <button
                        type="button"
                        class:selected={item.id === selectedId}
                        on:click={() => dispatch('select', item)}
                    >
                        {#if preview(item)}
                            <img src={preview(item)} alt="" loading="lazy" />
                        {/if}
                        <span class="item-summary">
                            <strong>{label(item)}</strong>
                            {#each [${summaryFields.map((field) => quote(field)).join(', ')}] as field}
                                {#if item?.[field]}
                                    <small>{String(item[field])}</small>
                                {/if}
                            {/each}
                        </span>
                    </button>
                </li>
            {/each}
        </ul>
    {:else}
        <p class="empty-state">No ${spec.modelLower}s found.</p>
    {/if}
</div>

<!-- AILTIRE_CUSTOM_MARKUP_START -->
<!-- Add custom list markup here. -->
<!-- AILTIRE_CUSTOM_MARKUP_END -->

<style>
    .${spec.modelLower}-list ul {
        display: flex;
        flex-direction: column;
        gap: 8px;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .search-wrap {
        position: sticky;
        top: 0;
        z-index: 1;
        background: #fff;
        padding-bottom: 10px;
    }
    .search-wrap input {
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
        font: inherit;
        padding: 9px 10px;
        width: 100%;
    }
    .${spec.modelLower}-list button {
        align-items: center;
        background: #fff;
        border: 1px solid #d8d8d8;
        border-radius: 6px;
        cursor: pointer;
        display: grid;
        gap: 10px;
        grid-template-columns: 64px minmax(0, 1fr);
        min-height: 74px;
        padding: 6px 10px 6px 6px;
        text-align: left;
        width: 100%;
    }
    .${spec.modelLower}-list button.selected {
        background: #fff9d9;
        border-color: #b39200;
    }
    .item-summary {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }
    .item-summary strong, .item-summary small {
        overflow-wrap: anywhere;
    }
    .${spec.modelLower}-list img {
        background: #eee;
        border-radius: 5px;
        height: 64px;
        object-fit: cover;
        width: 64px;
    }
    .empty-state { color: #666; margin: 0; }
</style>
`;
}

function renderFieldControl(attr) {
    const name = attr.name;
    const label = name[0].toUpperCase() + name.slice(1);
    const type = String(attr.type || '').toLowerCase();
    const inputType = fileTypeToInputType(type);

    if (type === 'boolean' || type === 'checkbox') {
        return `
    <div class="form-group">
        <label for="${name}">
            <input id="${name}" type="checkbox" bind:checked={draft.${name}} />
            ${label}
        </label>
    </div>`;
    }

    if (type === 'file' || type === 'blob') {
        return `
    <div class="form-group">
        <label for="${name}">${label}</label>
        <input id="${name}File" type="file" on:change={(event) => readFile(event, '${name}')} />
        <textarea id="${name}" bind:value={draft.${name}} rows="4" placeholder="Base64 or text content"></textarea>
    </div>`;
    }

    if (isRichField(attr)) {
        return `
    <div class="form-group">
        <label for="${name}">${label}</label>
        <textarea id="${name}" bind:value={draft.${name}} rows="5"></textarea>
    </div>`;
    }

    return `
    <div class="form-group">
        <label for="${name}">${label}</label>
        <input id="${name}" type="${inputType}" bind:value={draft.${name}} />
    </div>`;
}

function renderAssociationControl(assoc) {
    const name = assoc.name;
    const label = name[0].toUpperCase() + name.slice(1);
    const many = assoc.cardinality === 'n';
    return `
    <div class="form-group">
        <label for="${name}">${label}</label>
        <textarea id="${name}" bind:value={associationText.${name}} rows="${many ? 4 : 2}" placeholder="${many ? 'JSON array or comma-separated values' : 'JSON object or identifier'}"></textarea>
    </div>`;
}

function renderForm(spec) {
    const attributeFields = spec.attributes.map(renderFieldControl).join('\n');
    const associationFields = spec.associations.map(renderAssociationControl).join('\n');
    const associationDefaults = spec.associations.map((assoc) => `        ${assoc.name}: ''`).join(',\n');
    const associationParser = spec.associations.map((assoc) => {
        const name = assoc.name;
        return `
        if (associationText.${name} !== undefined) {
            const raw = String(associationText.${name} || '').trim();
            if (raw) {
                try {
                    payload.${name} = JSON.parse(raw);
                } catch {
                    payload.${name} = raw.includes(',') ? raw.split(',').map((item) => item.trim()).filter(Boolean) : raw;
                }
            } else {
                payload.${name} = ${assoc.cardinality === 'n' ? '[]' : 'null'};
            }
        }`;
    }).join('\n');

    return `<script>
    export let element = {};
    export let onSave;

    let draft = {};
    let associationText = {
${associationDefaults}
    };
    let formError = '';
    let isSaving = false;

    $: if (element && element !== draft) {
        draft = JSON.parse(JSON.stringify(element || {}));
        associationText = {
${spec.associations.map((assoc) => `            ${assoc.name}: stringifyAssociation(draft.${assoc.name})`).join(',\n')}
        };
    }

    function stringifyAssociation(value) {
        if (value === undefined || value === null) return '';
        if (typeof value === 'string') return value;
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    async function readFile(event, fieldName) {
        const file = event.currentTarget.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || '');
            draft[fieldName] = result.includes(',') ? result.split(',')[1] : result;
            draft[fieldName + 'FileName'] = file.name;
        };
        reader.readAsDataURL(file);
    }

    async function save() {
        if (isSaving) return;
        formError = '';
        const payload = JSON.parse(JSON.stringify(draft || {}));
${associationParser}
        isSaving = true;
        try {
            await Promise.resolve(onSave(payload));
        } catch (error) {
            formError = error?.response?.data?.error || error?.message || 'Unable to save record.';
        } finally {
            isSaving = false;
        }
    }

    // AILTIRE_CUSTOM_START
    // Add custom form logic here.
    // AILTIRE_CUSTOM_END
</script>

<form on:submit|preventDefault={save}>
${attributeFields}
${associationFields}

    {#if formError}
        <p class="form-error">{formError}</p>
    {/if}

    <button type="submit" class="save-button" disabled={isSaving} aria-busy={isSaving}>
        {#if isSaving}
            <span>Saving...</span>
        {:else}
            <span>Save ${spec.modelName}</span>
        {/if}
    </button>
</form>

<!-- AILTIRE_CUSTOM_MARKUP_START -->
<!-- Add custom form markup here. -->
<!-- AILTIRE_CUSTOM_MARKUP_END -->

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 520px;
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin: 0;
    }
    label {
        font-weight: 700;
    }
    input, textarea {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        font: inherit;
    }
    textarea {
        min-height: 96px;
    }
    .save-button {
        align-items: center;
        background: #007bff;
        border: 0;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        padding: 10px 12px;
    }
    .save-button:disabled {
        opacity: 0.85;
        cursor: not-allowed;
    }
    .form-error {
        color: #b00020;
        margin: 0;
    }
</style>
`;
}

function renderDetail(spec) {
    const attributeBlocks = spec.attributes.map((attr) => {
        const label = attr.name[0].toUpperCase() + attr.name.slice(1);
        const type = String(attr.type || '').toLowerCase();
        const maybeImage = /thumbnail|image|photo|avatar|picture/i.test(attr.name) || type === 'file';
        const maybeVideo = /video/i.test(attr.name) || (type === 'blob' && /video/i.test(String(attr.file || '')));
        return `
    {#if element?.${attr.name} !== undefined && element?.${attr.name} !== null && element?.${attr.name} !== ''}
        <div class="detail-item">
            <span class="detail-label">${label}:</span>
            ${maybeImage ? `<img class="preview-image" src={displayValue(element.${attr.name})} alt="${label}" />` : ''}
            ${maybeVideo ? `<video class="preview-video" src={displayValue(element.${attr.name})} controls preload="metadata"></video>` : ''}
            <pre>{renderValue(element.${attr.name})}</pre>
        </div>
    {/if}`;
    }).join('\n');

    const associationBlocks = spec.associations.map((assoc) => {
        const label = assoc.name[0].toUpperCase() + assoc.name.slice(1);
        return `
    {#if element?.${assoc.name} !== undefined && element?.${assoc.name} !== null}
        <div class="detail-item">
            <span class="detail-label">${label}:</span>
            <pre>{renderValue(element.${assoc.name})}</pre>
        </div>
    {/if}`;
    }).join('\n');

    return `<script>
    export let element = {};

    function renderValue(value) {
        if (value === undefined || value === null) return '';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch {
                return String(value);
            }
        }
        return String(value);
    }

    function displayValue(value) {
        if (value === undefined || value === null) return '';
        if (typeof value === 'string') return value;
        return renderValue(value);
    }

    // AILTIRE_CUSTOM_START
    // Add custom detail helpers here.
    // AILTIRE_CUSTOM_END
</script>

<div class="${spec.modelLower}-detail">
    <h3>${spec.modelName}: {element?.${spec.primaryField} || element?.name || element?.id}</h3>
${attributeBlocks}
${associationBlocks}
</div>

<!-- AILTIRE_CUSTOM_MARKUP_START -->
<!-- Add custom detail markup here. -->
<!-- AILTIRE_CUSTOM_MARKUP_END -->

<style>
    .${spec.modelLower}-detail {
        background: #fff;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
    }
    .detail-item { margin-bottom: 15px; }
    .detail-label { font-weight: 700; color: #555; display: block; margin-bottom: 6px; }
    pre {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 6px;
        margin: 0;
        padding: 10px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .preview-image, .preview-video {
        display: block;
        max-width: 100%;
        border-radius: 6px;
        margin-bottom: 8px;
    }
</style>
`;
}

function writeGeneratedFile(target, content, sourceMTime) {
    const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    const existingMTime = getMTime(target);
    if (existing && existingMTime > sourceMTime) {
        return { skipped: true, reason: 'target-newer' };
    }

    if (existing) {
        if (existing === content) {
            return { skipped: true, reason: 'unchanged' };
        }
        const markerPairs = target.endsWith('.svelte')
            ? [
                ['<!-- AILTIRE_CUSTOM_MARKUP_START -->', '<!-- AILTIRE_CUSTOM_MARKUP_END -->'],
                ['// AILTIRE_CUSTOM_START', '// AILTIRE_CUSTOM_END'],
            ]
            : [
                ['// AILTIRE_CUSTOM_START', '// AILTIRE_CUSTOM_END'],
            ];
        content = mergeMarkedSections(existing, content, markerPairs);
    }

    ensureDir(path.dirname(target));
    fs.writeFileSync(target, content);
    return { skipped: false };
}

function mergeMarkedSections(existing, generated, markerPairs) {
    if (!existing) {
        return generated;
    }
    let merged = generated;
    for (const [startMarker, endMarker] of markerPairs) {
        const existingBlock = extractBlock(existing, startMarker, endMarker);
        if (existingBlock !== null) {
            merged = replaceBlock(merged, startMarker, endMarker, existingBlock);
        }
    }
    return merged;
}

function extractBlock(content, startMarker, endMarker) {
    const start = content.indexOf(startMarker);
    const end = content.indexOf(endMarker);
    if (start === -1 || end === -1 || end < start) {
        return null;
    }
    return content.slice(start + startMarker.length, end);
}

function replaceBlock(content, startMarker, endMarker, newBlock) {
    const start = content.indexOf(startMarker);
    const end = content.indexOf(endMarker);
    if (start === -1 || end === -1 || end < start) {
        return content;
    }
    return content.slice(0, start + startMarker.length) + newBlock + content.slice(end);
}

function _getClass(className, context) {
    if (!className && context?.definition?.name) {
        className = context.definition.name;
    }
    if (!global.classes) {
        return context || null;
    }
    if (global.classes.hasOwnProperty(className)) {
        return global.classes[className];
    }
    for (const name in global.classes) {
        if (name.toLowerCase() === String(className || '').toLowerCase()) {
            return global.classes[name];
        }
    }
    return context || null;
}
