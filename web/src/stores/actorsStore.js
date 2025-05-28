import {writable, get, derived} from "svelte/store";
import {API_BASE_URL} from "../config";
import {Actor} from "../components/elements/Actor";
import {UseCase} from "../components/elements/UseCase";
import {Scenario} from "../components/elements/Scenario";

// The main store to hold the entire architecture
export const actors = writable({});
export const actorNodes = derived(actors, ($actors) => {
    const idMap = {};
    const rootNodes = [];
    for (let aname in $actors) {
        let actor = $actors[aname];
        idMap[aname] = {
            ...actor,
            id: aname,
            type: "Actor",
            _children: [],
            _view: Actor,
        };
        for (let sname in actor.scenarios) {
            let scenario = actor.scenarios[sname];
            idMap[sname] = {...scenario, id: sname, type: "Scenario", _view: Scenario }
            idMap[sname].parent = uname;
            idMap[aname]._children.push(idMap[sname]);
        }
        for (let uname in actor.usecases) {
            let usecase = actor.usecases[uname];
            idMap[uname] = {...usecase, id: uname, type: "UseCase", _view: UseCase, _children: []};
            idMap[uname].parent = aname;
            idMap[aname]._children.push(idMap[uname]);
            for (let sname in usecase.scenarios) {
                let scenario = actor.scenarios[sname];
                idMap[sname] = {
                    ...scenario,
                    id: sname,
                    name: sname,
                    type: "Scenario",
                    _view: Scenario
                };
                idMap[sname].parent = uname;
                idMap[uname]._children.push(idMap[sname]);
            }
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
export async function fetchActors() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/actor/list`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        actors.set(data);
    } catch (err) {
        console.error("Error fetching actors: ", err);
    }
}