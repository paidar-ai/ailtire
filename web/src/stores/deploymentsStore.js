import {writable, get, derived} from "svelte/store";
import {API_BASE_URL} from "../config";

// The main store to hold the entire architecture
export const environments = writable({});
export const environmentNodes = derived(environments, ($environments) => {
    let idMap = {};
    let rootNodes = [];
    
    for(let iname in $environments) {
        let env = $environments[iname];
        idMap[iname] = {...env, id:iname, name:iname, type:"Environment", _children: [] };
        for(let sname in env.stacks) {
            let stack = env.stacks[sname];
            idMap[sname] = {...stack, id:sname, name:sname, type:"Stack"};
            idMap[sname].parent = iname;
            idMap[iname]._children.push(idMap[sname]);
        }
    }
    for (const id in idMap) {
        if (!idMap[id].parent) {
            rootNodes.push(idMap[id]);
        }
    }
    return rootNodes;
});
export const physicals = writable({});
export const physicalNodes = derived(physicals, ($physicals) => {
    const idMap = {};
    const rootNodes = [];

    for (let pname in $physicals.environments) {
        mapEnvironment(null, $physicals.environments[pname]);
    }

    function mapEnvironment(parent, env) {
        idMap[env.name] = {...env, id: env.name, type: "environment", _children: []};
        if (parent) {
            idMap[env.name].parent = parent;
            idMap[parent]._children.push(idMap[env.name]);
        }
        for (let pname in env.physical?.locations) {
            let id = env.name + pname;
            let lid = env.name + "Locations";
            if(!idMap.hasOwnProperty(env.name + "Locations")) {
                idMap[lid] = {id: lid, name: "Locations", type: "Location", _children: []};
                idMap[lid].parent = env.name;
                idMap[env.name]._children.push(idMap[lid]);
            }
            let location = env.physical.locations[pname];
            idMap[id] = {...location, id: id, name: pname, type: "Location"};
            idMap[id].parent = lid;
            idMap[lid]._children.push(idMap[id]);
        }
        for(let sname in env.physical?.compute) {
            let lid = env.name + "Compute";
            if(!idMap.hasOwnProperty(env.name + "Compute")) {
                idMap[lid] = {id: lid, name: "Compute", type: "Compute", _children: []};
                idMap[lid].parent = env.name;
                idMap[env.name]._children.push(idMap[lid]);
            }
           idMap[sname] = {...env.physical.compute[sname], id: sname, name:sname, type: "Compute"};
           idMap[sname].parent = lid;
           idMap[lid]._children.push(idMap[sname]);
        }
        for(let sname in env.physical?.storage) {
            let lid = env.name + "Storage";
            if(!idMap.hasOwnProperty(env.name + "Storage")) {
                idMap[lid] = {id: lid, name: "Storage", type: "Storage", _children: []};
                idMap[lid].parent = env.name;
                idMap[env.name]._children.push(idMap[lid]);
            }
            idMap[sname] = {...env.physical.storage[sname], id: sname, name:sname, type: "Storage"};
            idMap[sname].parent = lid;
            idMap[lid]._children.push(idMap[sname]);
        }
        for(let sname in env.physical?.network?.devices) {
            let lid = env.name + "Network";
            if(!idMap.hasOwnProperty(env.name + "Network")) {
                idMap[lid] = {id: lid, name: "Network", type: "Network", _children: []};
                idMap[lid].parent = env.name;
                idMap[env.name]._children.push(idMap[lid]);
            }
            idMap[sname] = {...env.physical.network.devices[sname], id: sname, name:sname, type: "Network"};
            idMap[sname].parent = lid;
            idMap[lid]._children.push(idMap[sname]);
        }
    }

    for (const id in idMap) {
        if (!idMap[id].parent) {
            rootNodes.push(idMap[id]);
        }
    }
    return rootNodes;
});
export async function fetchDeployments() {
    await fetchEnvironments();
    await fetchPhysicals();
}
// Fetch the architecture from the backend REST API
export async function fetchEnvironments() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/deployment/list`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        let envs = {};
        for(let ename in data.environments) {
            envs[ename] = data.environments[ename];
        }
        environments.set(envs);
    } catch (err) {
        console.error("Error fetching usecases: ", err);
    }
}
export async function fetchPhysicals() {
    // usecases.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
        const res = await fetch(`${API_BASE_URL}/deployment/physical`); // Replace with your API URL
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Update the store with fetched data
        physicals.set(data);
    } catch (err) {
        console.error("Error fetching usecases: ", err);
    }
}

function _connectPhysicalNodes(environment) {
    // Connect all of the storage with the hosts that mount them.
    for (let cname in environment.compute) {
        let compute = environment.compute[cname];
        for (let dname in compute.disks) {
            let disk = compute.disks[dname];
            if (environment.storage.hasOwnProperty(disk.volume)) {
                disk.volumeObject = environment.storage[disk.volume];
                if (!environment.storage[disk.volume].hasOwnProperty('consumers')) {
                    environment.storage[disk.volume].consumers = {};
                }
                environment.storage[disk.volume].consumers[cname] = compute;
            }
        }
    }
    // Connect all of the network interfaces to the networks
    for (let nname in environment.network?.devices) {
        let device = environment.network.devices[nname];
        device.networkObjects = {};
        for (let i in device.networks) {
            let netName = device.networks[i];
            device.networkObjects[netName] = environment.network.networks[netName];
        }
    }
    for (let dname in environment.compute) {
        let compute = environment.compute[dname];
        for (let nname in compute.networks) {
            if (!environment.network.networks[nname].devices) {
                environment.network.networks[nname].devices = {};
            }
            environment.network.networks[nname].devices[dname] = compute;
        }
    }
    for (let dname in environment.storage) {
        let storage = environment.storage[dname];
        for (let nname in storage.networks) {
            if (!environment.network.networks[nname].devices) {
                environment.network.networks[nname].devices = {};
            }
            environment.network.networks[nname].devices[dname] = storage;
        }
    }
}