import * as THREE from "three";
import AText from "$lib/AText.js";
import {Action} from "../Action";

const defaults = {
    fontSize: 20,
    height: 50,
    width: 100,
    depth: 20,
}

export function create3D(node, type) {
    let opacity = node.opacity || 0.75;
    let color = node.color || "#ff7722";
    if (type === 'Selected') {
        color = "yellow";
    } else if (type === 'Targeted') {
        color = "red";
    } else if (type === 'Sourced') {
        color = "green";
    }
    let size = _calculateBox(node);
    let height = size.h;
    let width = size.w;
    let depth = size.d;
    let geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0,
        reflectivity: 0.2,
        thickness: 6,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const box = new THREE.Mesh(geometry, material);
    let name = node.name;
    if (!name) {
        name = node.id;
    }
    let label = AText.view3D({
        text: name.replace(/\s/g, '\n'),
        color: "#ffffff",
        width: width,
        size: defaults.fontSize / 2,
        verticalAlign: 'top',
        horizontalAlign: 'center',
        parent: box
    });
    box.add(label)

    box.position.set(node.x, node.y, node.z);
    box.aid = node.id;
    node.box = size.r;
    return box;
}

export function view3D(element, mode, parent) {
    let data = {nodes: {}, links: []};
    if (mode === "add" && parent) {
        data.nodes[element.id] = {
            id: element.id, name: element.name,
            view: create3D,
            rbox: {
                parent: parent.id,
                fz: -600,
            }
        };
        data.links.push({target: element.id, source: parent.id, width: 1, value: 40, color: "#aaffff"})
    } else {
        data.nodes[element.id] = {
            id: element.id, name: element.name,
            view: create3D,
            fx: 0,
            fy: 0,
            fz: 0,
        };
    }
    let rbox = {};
    let sbox = _calculateBox(data.nodes[element.id]);
    let yoffset = sbox.h;
    let luid = element.id;
    for (let i in element.steps) {
        let step = element.steps[i];
        let uid = `${element.id}-${i}`;
        rbox = {parent: luid, fx: 0, fy: -yoffset, fz: 0};
        let description = ""
        for (let pname in step.parameters) {
            description += `--${pname} ${step.parameters[pname]}\n`;
        }
        data.nodes[uid] = {
            id: uid,
            name: step.action,
            description: description,
            view: createStep3D,
            rbox: rbox,
            box: 10
        };
        yoffset = 30;
        // Add the action for the step.
        let action = step.action;
        if (!data.nodes.hasOwnProperty(action)) {
            data.nodes[action] = {
                id: action,
                name: action.replace(/\//, '\n'),
                view: Action.get3DObject,
                // w: 80, h: 30,
                fontSize: 12,
                rbox: {
                     parent: uid,
                     fz: -150
                }
            };
        }
        data.links.push({source: uid, target: action, value: 0.1});
        // Add the package for the action.
        let pkg = action.pkg;
        if (pkg) {
            if (!data.nodes.hasOwnProperty(pkg.shortname)) {
                data.nodes[pkg.shortname] = {
                    id: pkg.shortname,
                    name: pkg.name,
                    color: pkg.color,
                    // view: APackage.view3D,
                    // rbox: {
                    //     parent: scenario.id,
                    //     x: {min: -300, max: 300},
                    //     y: {min: -300, max: 300},
                    //     fz: -450
                    // }
                };
            }
            if (!action.cls) {
                data.links.push({source: action.name, target: pkg.shortname, value: 0.1});
            }
        }
        // Add the class if it is a class action.
        if (action.cls) {
            let cls = action.cls;
            if (!data.nodes.hasOwnProperty(cls)) {
                data.nodes[cls] = {
                    id: cls, name: cls,
                    // view: AModel.view3D,
                    // rbox: {
                    //     parent: scenario.id,
                    //     x: {min: -300, max: 300},
                    //     y: {min: -300, max: 300},
                    //     fz: -300,
                    // }
                };
                data.links.push({source: cls, target: pkg.shortname, value: 0.1});
            }
            data.links.push({target: cls, source: action.name, value: 0.1});
        }
        luid = uid;
    }
    return data;
}
export function createStep3D(node, type) {
    let opacity = node.opacity || 1;
    let color = node.color || "#aa8844";
    if (type === 'Selected') {
        color = "yellow";
    } else if (type === 'Targeted') {
        color = "red";
    } else if (type === 'Sourced') {
        color = "green";
    }
    let w = Math.max(150, node.name.length * defaults.fontSize / 2);
    let geometry = new THREE.BoxGeometry(w, 20, 5);
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0,
        reflectivity: 0.2,
        thickness: 6,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const box = new THREE.Mesh(geometry, material);
    let label = AText.view3D({text: node.name, color: "#ffffff", parent: box, width: 200, size: 14});
    if (node.x !== undefined) {
        box.position.set(node.x, node.y, node.z);
    }
    box.aid = node.id;
    node.box = 0;
    return box;
}


function _calculateBox(node) {
    let fontSize = node.fontSize || defaults.fontSize;
    let nameArray = node.name.split(/\s/).map(item => {
        return item.length;
    });
    let maxLetters = nameArray.reduce(function (a, b) {
        return Math.max(a, b);
    }, -Infinity);
    let height = (nameArray.length * fontSize) / 2 + 10;
    let width = maxLetters * (fontSize / 2) + 20;
    let depth = defaults.depth;
    let radius = Math.sqrt(width * width + height * height + depth * depth) / 2;
    return {w: width, h: height * 2, d: depth, r: radius};
}