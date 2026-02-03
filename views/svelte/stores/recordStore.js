import { writable } from 'svelte/store';
import { api } from '../api';

export const currentRecord = writable(null);

export async function loadRecord(pkg, model, id) {
    const rec = await api().get(pkg, model, id);
    currentRecord.set(rec);
    return rec;
}

export async function saveRecord(pkg, model, id, data) {
    const saved = id
        ? await api().update(pkg, model, id, data)
        : await api().create(pkg, model, data);
    currentRecord.set(saved);
    return saved;
}