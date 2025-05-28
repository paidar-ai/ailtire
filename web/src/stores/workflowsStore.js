import {writable, get, derived} from "svelte/store";
import {API_BASE_URL} from "../config";
import {selectedRun} from "./store.js";

// The main store to hold the entire architecture
export const workflows = writable({});
export const workflowInstances = writable({});
export const workflowNodes = derived(workflows, ($workflows) => {
    const idMap = {};
    const rootNodes = [];
    for (let uname in $workflows.workflows) {
        let workflow = $workflows.workflows[uname];
        idMap[uname] = {...workflow, id: uname, type: "Workflow", _children: []};
    }
    for(let cname in $workflows.subcategories) {
        let subcategory = $workflows.subcategories[cname];
        mapCategory(null, subcategory);
    }
    function mapCategory(parent, category) {
        idMap[category.prefix] = {...category, id: category.prefix, name:category.prefix, type: "Category", _children: []};
        if (parent) {
            idMap[category.prefix].parent = parent;
            idMap[parent]._children.push(idMap[category.prefix]);
        }
        for (let cname in category.subcategories) {
            mapCategory(category.prefix, category.subcategories[cname]);
        }
        for (let uname in category.workflows) {
            let workflow = category.workflows[uname];
            idMap[uname] = {...workflow, id: uname, type: "Workflow", _children: []};
            idMap[uname].parent = category.prefix;
            idMap[category.prefix]._children.push(idMap[uname]);
        }
    }

    for (const id in idMap) {
        if (!idMap[id].parent) {
            rootNodes.push(idMap[id]);
        }
    }
    return rootNodes;
});
export const workflowInstanceNodes = derived(workflowInstances, ($workflowInstances) => {
    let results = [];
    for(let name in $workflowInstances) {
        let workflowInstance = $workflowInstances[name];
        for(let i in workflowInstance) {
            let workflowItem = workflowInstance[i];
            results.push(workflowItem);
        }
    }
    return results;
});

export async function fetchRun(run) {
    try {
        const res = await fetch(`${API_BASE_URL}/workflow/instance?name=${run.name}&id=${run.id}`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        selectedRun.set(data);
    } catch (err) {
        console.error("Error fetching run: ", err);
    }
}
// Fetch the architecture from the backend REST API
export async function fetchWorkflows() {
    // workflows.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/workflow/list`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        workflows.set(data);
    } catch (err) {
        console.error("Error fetching workflows: ", err);
    }
    try {
        const res = await fetch(`${API_BASE_URL}/workflow/instances`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        workflowInstances.set(data);
    } catch (err) {
        console.error("Error fetching workflows: ", err);
    }
}

// Get a specific node by its ID for convenience (optional utility)
export function getNodeById(id) {
    const {data} = get(workflows);

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