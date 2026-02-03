import {writable, get, derived} from "svelte/store";
// The main store to hold the entire architecture
export const currentModel = writable(null);
export const llmModels = writable({});

export async function fetchLLMModels() {
    try {
        // Fetch the hosted JSON file
        const response = await fetch(`/api/ai/list`); // Update with your hosting URL if necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const modelJSON = await response.json();
        let modelList = [];
        for(let aname in modelJSON) {
            let models = modelJSON[aname];
            for(let mname in models) {
                let model = models[mname];
                modelList.push(`${aname}:${model}`);
            }
        }
        llmModels.set(modelList); // Set the store value with the parsed JSON data
    } catch (error) {
        console.error('Error fetching layers:', error);
    }
}

export async function setCurrentModel(id) {
	await fetchLLMModels();
	const modelList = get(llmModels);
	const modelFound = modelList[id];
	if(modelFound && modelFound.id === id) {
        const response = await fetch(`/api/ai/setModel?id=${id}`); // Update with your hosting URL if necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        currentModel.set(modelFound);
	} else {
		console.error(`Customer not found with ${id}`);
	}
}
