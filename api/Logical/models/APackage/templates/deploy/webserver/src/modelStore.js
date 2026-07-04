import { writable } from 'svelte/store';

const DEFAULT_STATE = {
  items: [],
  selectedId: null,
  selectedItem: null,
  draft: null,
  query: '',
  loading: false,
  saving: false,
  error: null,
  dirty: false,
  path: '',
  capabilities: {
    create: true,
    update: true,
    remove: true
  }
};

function cloneValue(value) {
  if (value == null) {
    return value;
  }
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function normalizePath(path) {
  return String(path || '').trim().replace(/^\/+/, '').replace(/\/+$/, '');
}

function defaultKeyOf(item) {
  return item?.id || item?.name || item?.title || null;
}

function normalizeItem(item, keyOf) {
  const next = item && typeof item === 'object' ? { ...item } : {};
  const key = keyOf(next);
  if (key != null && next.id == null) {
    next.id = key;
  }
  return next;
}

function unwrapListResponse(result) {
  if (Array.isArray(result)) {
    return result;
  }
  if (Array.isArray(result?.data)) {
    return result.data;
  }
  if (Array.isArray(result?.body)) {
    return result.body;
  }
  return [];
}

function unwrapItemResponse(result) {
  if (result == null) {
    return null;
  }
  if (Array.isArray(result?.data)) {
    return result.data[0] || null;
  }
  if (result?.data && typeof result.data === 'object') {
    return result.data;
  }
  if (result?.body && typeof result.body === 'object') {
    return result.body;
  }
  return result;
}

async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || response.statusText || 'Request failed');
  }

  if (!text) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(text);
  }

  return text;
}

async function requestJson(url, init = {}) {
  const hasBody = init.body != null;
  const response = await fetch(url, {
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {})
    },
    ...init
  });
  return await readJsonResponse(response);
}

function createTransport(path, options) {
  const basePath = normalizePath(options.basePath || path);
  const prefix = basePath ? `/${basePath}` : '';
  const method = options.writeMethod || 'POST';

  return {
    list: options.list || (async () => await requestJson(`${prefix}/list`)),
    get: options.get || (async (id) => await requestJson(`${prefix}/get?id=${encodeURIComponent(id)}`)),
    create: options.create || (async (payload) => await requestJson(`${prefix}/create`, {
      method,
      body: JSON.stringify(payload)
    })),
    update: options.update || (async (id, payload) => await requestJson(`${prefix}/update`, {
      method,
      body: JSON.stringify({ id, ...payload })
    })),
    remove: options.remove || (async (id) => await requestJson(`${prefix}/delete?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }))
  };
}

export function createModelStore(options = {}) {
  const path = normalizePath(options.path || '');
  const keyOf = options.keyOf || defaultKeyOf;
  const normalize = options.normalize || ((item) => normalizeItem(item, keyOf));
  const transport = createTransport(path, options);
  const { subscribe, set } = writable({
    ...DEFAULT_STATE,
    path,
    capabilities: {
      create: Boolean(transport.create),
      update: Boolean(transport.update),
      remove: Boolean(transport.remove)
    }
  });

  let state = {
    ...DEFAULT_STATE,
    path,
    capabilities: {
      create: Boolean(transport.create),
      update: Boolean(transport.update),
      remove: Boolean(transport.remove)
    }
  };

  function commit(mutator) {
    state = typeof mutator === 'function' ? mutator(state) : { ...state, ...mutator };
    set(state);
    return state;
  }

  function resolveId(itemOrId) {
    if (itemOrId == null) {
      return state.selectedId;
    }
    if (typeof itemOrId === 'object') {
      return keyOf(itemOrId);
    }
    return itemOrId;
  }

  function upsertItem(item, { select = false } = {}) {
    const normalized = normalize(item);
    const id = resolveId(normalized);
    if (id == null) {
      return normalized;
    }

    const nextItems = state.items.some((entry) => resolveId(entry) === id)
      ? state.items.map((entry) => (resolveId(entry) === id ? { ...entry, ...normalized } : entry))
      : [...state.items, normalized];

    const shouldSelect = select || state.selectedId === id;
    const selectedItem = shouldSelect ? normalized : state.selectedItem;
    const draft = shouldSelect ? cloneValue(normalized) : state.draft;

    commit({
      items: nextItems,
      selectedId: shouldSelect ? id : state.selectedId,
      selectedItem,
      draft,
      dirty: shouldSelect ? false : state.dirty
    });

    return normalized;
  }

  function setItems(items, { selectFirst = false, preserveSelection = true } = {}) {
    const normalizedItems = unwrapListResponse(items).map(normalize);
    let selectedId = preserveSelection ? state.selectedId : null;

    if (selectFirst && !selectedId) {
      selectedId = resolveId(normalizedItems[0]);
    }

    const selectedItem = normalizedItems.find((entry) => resolveId(entry) === selectedId) || null;

    commit({
      items: normalizedItems,
      selectedId,
      selectedItem,
      draft: selectedItem ? cloneValue(selectedItem) : null,
      loading: false,
      saving: false,
      error: null,
      dirty: false
    });

    return normalizedItems;
  }

  async function loadAll() {
    commit({ loading: true, error: null });
    try {
      const items = await transport.list();
      return setItems(items, { selectFirst: true, preserveSelection: true });
    } catch (error) {
      commit({ loading: false, error: error?.message || String(error) });
      throw error;
    }
  }

  async function select(itemOrId) {
    const id = resolveId(itemOrId);
    if (id == null) {
      commit({ selectedId: null, selectedItem: null, draft: null, dirty: false, error: null });
      return null;
    }

    const localItem = typeof itemOrId === 'object'
      ? normalize(itemOrId)
      : state.items.find((entry) => resolveId(entry) === id) || null;

    if (localItem) {
      commit({
        selectedId: id,
        selectedItem: localItem,
        draft: cloneValue(localItem),
        error: null,
        dirty: false
      });
      return localItem;
    }

    commit({ loading: true, error: null });
    try {
      const fetched = normalize(unwrapItemResponse(await transport.get(id)));
      upsertItem(fetched, { select: true });
      commit({ loading: false });
      return fetched;
    } catch (error) {
      commit({ loading: false, error: error?.message || String(error) });
      throw error;
    }
  }

  function clearSelection() {
    commit({
      selectedId: null,
      selectedItem: null,
      draft: null,
      dirty: false,
      error: null
    });
  }

  function setDraft(nextDraft) {
    commit({
      draft: cloneValue(nextDraft),
      dirty: true
    });
  }

  function patchDraft(patch) {
    const base = state.draft ? cloneValue(state.draft) : {};
    commit({
      draft: { ...base, ...cloneValue(patch) },
      dirty: true
    });
  }

  async function refresh(itemOrId = state.selectedId) {
    const id = resolveId(itemOrId);
    if (id == null) {
      return null;
    }

    commit({ loading: true, error: null });
    try {
      const fetched = normalize(unwrapItemResponse(await transport.get(id)));
      upsertItem(fetched, { select: id === state.selectedId });
      commit({ loading: false });
      return fetched;
    } catch (error) {
      commit({ loading: false, error: error?.message || String(error) });
      throw error;
    }
  }

  async function create(payload) {
    commit({ saving: true, error: null });
    try {
      const created = normalize(unwrapItemResponse(await transport.create(payload)));
      const id = resolveId(created);
      const nextItems = state.items.some((entry) => resolveId(entry) === id)
        ? state.items.map((entry) => (resolveId(entry) === id ? { ...entry, ...created } : entry))
        : [...state.items, created];

      commit({
        items: nextItems,
        selectedId: id,
        selectedItem: created,
        draft: cloneValue(created),
        saving: false,
        dirty: false
      });

      return created;
    } catch (error) {
      commit({ saving: false, error: error?.message || String(error) });
      throw error;
    }
  }

  async function update(itemOrId, payload = null) {
    const id = resolveId(itemOrId);
    if (id == null) {
      throw new Error('Cannot update an item without an identifier.');
    }

    const draft = payload ? cloneValue(payload) : (state.draft ? cloneValue(state.draft) : {});
    commit({ saving: true, error: null });

    try {
      const updated = normalize(unwrapItemResponse(await transport.update(id, draft)));
      const nextItems = state.items.some((entry) => resolveId(entry) === id)
        ? state.items.map((entry) => (resolveId(entry) === id ? { ...entry, ...updated } : entry))
        : [...state.items, updated];

      commit({
        items: nextItems,
        selectedId: id,
        selectedItem: updated,
        draft: cloneValue(updated),
        saving: false,
        dirty: false
      });

      return updated;
    } catch (error) {
      commit({ saving: false, error: error?.message || String(error) });
      throw error;
    }
  }

  async function saveDraft(nextDraft = null) {
    const payload = nextDraft ? cloneValue(nextDraft) : (state.draft ? cloneValue(state.draft) : {});
    if (state.selectedId == null && resolveId(payload) == null) {
      return await create(payload);
    }
    return await update(state.selectedId ?? payload, payload);
  }

  async function remove(itemOrId = state.selectedId) {
    const id = resolveId(itemOrId);
    if (id == null) {
      return null;
    }

    commit({ saving: true, error: null });
    try {
      await transport.remove(id);
      const nextItems = state.items.filter((entry) => resolveId(entry) !== id);
      const nextSelection = state.selectedId === id ? null : state.selectedId;
      const selectedItem = nextSelection
        ? nextItems.find((entry) => resolveId(entry) === nextSelection) || null
        : null;

      commit({
        items: nextItems,
        selectedId: nextSelection,
        selectedItem,
        draft: selectedItem ? cloneValue(selectedItem) : null,
        saving: false,
        dirty: false
      });

      return true;
    } catch (error) {
      commit({ saving: false, error: error?.message || String(error) });
      throw error;
    }
  }

  function setQuery(query) {
    commit({ query: String(query || '') });
  }

  return {
    subscribe,
    loadAll,
    list: loadAll,
    select,
    clearSelection,
    refresh,
    create,
    update,
    saveDraft,
    remove,
    setItems,
    setDraft,
    patchDraft,
    setQuery,
    upsertItem,
    resolveId,
    get state() {
      return state;
    }
  };
}

export function summarizeItem(item) {
  if (!item || typeof item !== 'object') {
    return '';
  }
  return item.name || item.title || item.email || item.id || JSON.stringify(item);
}
