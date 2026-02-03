import * as THREE from "three";
import AText from "$lib/AText.js";
import {Actor} from "../Actor";
import {Scenario} from "../Scenario";

const defaults = {
    fontSize: 20,
    height: 50,
    width: 100,
    depth: 20,
}
export function create3D(node,type) {

    let opacity = node.opacity || 0.5;
    let fontSize = node.fontSize || defaults.fontSize;
    let color = node.color || "#aaaa00";

    if (type === 'Selected') {
        color = "yellow";
    } else if (type === 'Targeted') {
        color = "red";
    } else if (type === 'Sourced') {
        color = "green";
    }
    let nameArray = node.name.split(/\s/);
    let size = _calculateBox(node);
    let height = size.h;
    let width = size.w;
    let geometry = new THREE.SphereGeometry(1);

    geometry.applyMatrix4(new THREE.Matrix4().makeScale(width, height, size.d));
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
    const retval = new THREE.Mesh(geometry, material);
    retval.position.set(node.x || 0, node.y || 0, node.z || 0);
    let label = AText.view3D({text: nameArray.join('\n'), color: "#ffffff", width: width, size: fontSize/2, parent:retval, horizontalAlign:"center", verticalAlign: 'middle'});
    if (node.rotate) {
        if (node.rotate.x) {
            retval.applyMatrix4(new THREE.Matrix4().makeRotationX(node.rotate.x));
        }
        if (node.rotate.y) {
            retval.applyMatrix4(new THREE.Matrix4().makeRotationY(node.rotate.y));
        }
        if (node.rotate.z) {
            retval.applyMatrix4(new THREE.Matrix4().makeRotationZ(node.rotate.z));
        }
    }
    retval.aid = node.id;
    node.box = size.r;
    return retval;
}

export function view3D(element) {
    let data = {nodes: {}, links: []};

    data.nodes[element.id] = {
        id: element.id, name: element.name, fx: 0, fy: 0, fz: 0,
        view: create3D,
    };
    for (let j in element.scenarios) {
        let scenario =element.scenarios[j];
        let id = scenario.uid;
        data.nodes[id] = {
            id: id, name: scenario.name,
            view: Scenario.get3DObject,
            // rbox: {parent: element.id, z: {max: -200, min: -3000}}
        };
        for (let actor in scenario.actors) {
            let aname = actor.replace(/\s/g, '').toLowerCase();
            data.links.push({source: aname, target: id, value: 0.3, width: 2});
        }
        data.links.push({source: element.id, target: id, value: 0.1, width: 3, color: 'gray'});
    }

    for (let j in element.extended) {
        let suc = element.extended[j];
        data.nodes[j] = {
            id: j, name: suc.name, view: create3D,
            color: '#aaaaaa',
            // rbox: {parent: element.id, z: {max: 400, min: -200}}
        };
        data.links.push({source: element.id, target: j, value: 0.1, width: 3, color: 'gray'});
    }

    for (let j in element.extends) {
        let sucname = element.extends[j];
        let sucid = sucname.replace(/\s/g, '');
        data.nodes[sucid] = {
            id: sucid, name: sucname,
            view: create3D,
            color: '#aaaaff',
            // rbox: {parent: element.id, z: {max: 400, min: -200}}
        };
        data.links.push({target: element.id, source: sucid, value: 0.1, width: 3, color: 'gray'});
    }

    for (let j in element.includes) {
        let sucname = element.includes[j];
        let sucid = sucname.replace(/\s/g, '');
        data.nodes[sucid] = {
            id: sucid, name: sucname,
            view: create3D,
            color: '#aaffff',
            // rbox: {parent: element.id, z: {max: 400, min: -200}}
        };
        data.links.push({source: element.id, target: sucid, value: 0.1, width: 3, color: 'gray'});
    }
    for (let j in element.included) {
        let suc = element.included[j];
        data.nodes[j] = {
            id: j, name: suc.name,
            view: create3D,
            color: '#aaffaa',
            // rbox: {parent: element.id, z: {max: 400, min: -200}}
        };
        data.links.push({source: element.id, target: j, value: 0.1, width: 3, color: 'gray'});
    }

    for (let actor in element.actors) {
        let aname = actor.replace(/\s/g, '').toLowerCase();
        data.nodes[aname] = {
            id: aname, name: aname, view: Actor.get3DObject,
            // rbox: {parent: element.id, z: {max: 3000, min: 400}}
        };
        data.links.push({source: aname, target: element.id, value: 1, width: 3, color: '#ffffff'});
    }
    return data;
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