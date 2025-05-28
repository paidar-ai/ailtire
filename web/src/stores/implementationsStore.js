import {writable, get, derived} from "svelte/store";
import {API_BASE_URL} from "../config";

// The main store to hold the entire architecture
export const images = writable({});
export const imageNodes = derived(images, ($images) => {
    let rootNodes = [];
    for(let iname in $images) {
        rootNodes.push({id:iname, name:iname, type:"Image"});
    }
    return rootNodes;
})
export const components = writable({});
export const componentNodes = derived(components, ($components) => {
    const idMap = {};
    const rootNodes = [];
    for (let pname in $components.dependencies) {
        mapDependencies(null, $components.dependencies[pname]);
    }

    function mapDependencies(parent, component) {
        idMap[component.name] = {...component, id: component.name, type: "Component", _children: []};
        if (parent) {
            idMap[component.name].parent = parent;
            idMap[parent]._children.push(idMap[component.name]);
        }
        for (let pname in component.dependencies) {
            mapDependencies(component.name, component.dependencies[pname]);
        }
    }

    for (const id in idMap) {
        if (!idMap[id].parent) {
            rootNodes.push(idMap[id]);
        }
    }
    return rootNodes;
});
export async function fetchImplementations() {
    await fetchComponents();
    await fetchImages();
}
// Fetch the architecture from the backend REST API
export async function fetchComponents() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/implementation/thirdparty`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        components.set(data);
    } catch (err) {
        console.error("Error fetching usecases: ", err);
    }
}
export async function fetchImages() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/implementation/images`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        images.set(data);
    } catch (err) {
        console.error("Error fetching usecases: ", err);
    }
}