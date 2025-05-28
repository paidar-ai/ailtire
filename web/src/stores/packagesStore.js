import {writable, get, derived} from "svelte/store";
import {API_BASE_URL} from "../config";
import {Package} from "../components/elements/Package";
import {Model} from "../components/elements/Model";

// The main store to hold the entire architecture
export const packages = writable({});
export const models = writable({});
export const packageNodes = derived(packages, ($packages) => {
    const idMap = {};
    const rootNodes = [];
    for (let pname in $packages.subpackages) {
        mapSubPackage(null, $packages.subpackages[pname]);
    }

    function mapSubPackage(parent, pkg) {
        idMap[pkg.name] = {
            ...pkg,
            id: pkg.name,
            type: "Package",
            _children: [],
            _view: Package,
            expandLink: `${API_BASE_URL}/package/get?id=${pkg.name}`
        };
        if (parent) {
            idMap[pkg.name].parent = parent;
            idMap[parent]._children.push(idMap[pkg.name]);
        }
        for (let cname in pkg.classes) {
            idMap[cname] = {
                ...pkg.classes[cname],
                id: cname,
                name: cname,
                type: "Class",
                link: `${API_BASE_URL}/${cname}/list`,
                expandLink: `${API_BASE_URL}/model/get?id=${cname}`,
                _view: Model
            };
            idMap[cname].parent = pkg.name;
            idMap[pkg.name]._children.push(idMap[cname]);
        }
        for (let pname in pkg.subpackages) {
            mapSubPackage(pkg.name, pkg.subpackages[pname]);
        }
    }

    for (const id in idMap) {
        if (!idMap[id].parent) {
            rootNodes.push(idMap[id]);
        }
    }
    return rootNodes;
});
export const modelNodes = derived(models, ($models) => {
    const idMap = {};
    const rootNodes = [];
    for (let cname in $models) {
        idMap[cname] = {
            ...$models[cname],
            id: cname,
            expandLink: `${API_BASE_URL}/model/get?id=${cname}`,
            link: `${API_BASE_URL}/${cname}/list`,
            name: cname,
            type: "Class",
            _view: Model
        };
    }

    let sorted = Object.keys(idMap).sort();
    for (const i in sorted) {
        rootNodes.push(idMap[sorted[i]]);
    }
    return rootNodes;
});

// Fetch the architecture from the backend REST API
export async function fetchPackages() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/package/list`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        packages.set(data);
    } catch (err) {
        console.error("Error fetching usecases: ", err);
    }
    try {
        const res = await fetch(`${API_BASE_URL}/model/list`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        models.set(data);
    } catch (err) {
        console.error("Error fetching usecases: ", err);
    }
}

// Get a specific node by its ID for convenience (optional utility)
export function getNodeById(id) {
    const {data} = get(usecases);

    function findNode(nodes) {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node._children) {
                const childNode = findNode(node._children);
                if (childNode) return childNode;
            }
        }
        return null;
    }

    return findNode(data);
}