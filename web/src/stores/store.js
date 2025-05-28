import { writable } from "svelte/store";

export const selectedNode = writable(null);
export const selectedValue = writable(null);
export const theme = writable("light");
export const graph = writable(null);
export const selectedRun = writable(null);
export const selectedClass = writable(null);
export const selectedClassList = writable(null);
