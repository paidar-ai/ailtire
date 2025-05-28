import {writable, get, derived} from "svelte/store";
import {API_BASE_URL} from "../config";
import {UseCase} from "../components/elements/UseCase";
import {Scenario} from "../components/elements/Scenario";

// The main store to hold the entire architecture
export const usecases = writable({});
export const usecaseNodes = derived(usecases, ($usecases) => {
    const idMap = {};
    const rootNodes = [];
    for (let uname in $usecases) {
        let usecase = $usecases[uname];
        idMap[uname] = {...usecase, id: uname, type: "UseCase", _view: UseCase, _children: []};
        if (usecase.package) {
            if (!idMap.hasOwnProperty(usecase.package)) {
                idMap[usecase.package] = {id: usecase.package, name: usecase.package, type: "Package", _children: []};
            }
            idMap[uname].parent = usecase.package;
            idMap[usecase.package]._children.push(idMap[uname]);
        }
        for (let sname in usecase.scenarios) {
            let scenario = usecase.scenarios[sname];
            idMap[sname] = {...scenario, id: sname, type: "Scenario", _view: Scenario};
            idMap[sname].parent = uname;
            idMap[uname]._children.push(idMap[sname]);
        }
    }

    for (const id in idMap) {
        if (!idMap[id].parent) {
            rootNodes.push(idMap[id]);
        }
    }
    return rootNodes;
});

// Fetch the architecture from the backend REST API
export async function fetchUsecases() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/usecase/list`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        usecases.set(data);
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