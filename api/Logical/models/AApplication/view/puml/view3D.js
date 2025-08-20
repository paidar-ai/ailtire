import * as THREE from "three";
import AText from "$lib/AText.js";
import {UseCase} from "../UseCase";

const defaults = { fontSize: 20, height: 100, width: 50, depth: 50 };

export function create3D(node,type) {
    let color = node.color || "#aaaaaa";
    if (type === 'Selected') {
        color = "yellow";
    } else if (type === 'Targeted') {
        color = "red";
    } else if (type === 'Sourced') {
        color = "green";
    }
    let size = _calculateBox(node);
    const theta = Math.PI / 2;
    const group = new THREE.Group();
    const head = new THREE.SphereGeometry(15, 16, 12);
    const material = new THREE.MeshLambertMaterial({color: color, opacity: 1});
    const headObj = new THREE.Mesh(head, material);
    group.add(headObj);
    const body = new THREE.CylinderGeometry(3, 3, 50);
    const bodyObj = new THREE.Mesh(body, material);
    bodyObj.position.set(0, -25, 0);
    group.add(bodyObj);
    const arms = new THREE.CylinderGeometry(3, 3, 30);
    const armsObj = new THREE.Mesh(arms, material);
    armsObj.applyMatrix4(new THREE.Matrix4().makeRotationZ(theta));
    armsObj.position.set(0, -25, 0);
    group.add(armsObj);
    const rleg = new THREE.CylinderGeometry(3, 3, 30);
    const rlegObj = new THREE.Mesh(rleg, material);
    rlegObj.applyMatrix4(new THREE.Matrix4().makeRotationZ(theta / 2));
    rlegObj.position.set(11, -58, 0);
    group.add(rlegObj);

    const lleg = new THREE.CylinderGeometry(3, 3, 30);
    const llegObj = new THREE.Mesh(lleg, material);
    llegObj.applyMatrix4(new THREE.Matrix4().makeRotationZ(-theta / 2));
    llegObj.position.set(-11, -58, 0);
    group.add(llegObj);

    let label = AText.view3D({text: node.name.replace(/\s/g, '\n'), color: "#ffffff", width: size.w, size: defaults.fontSize, parent: group, horizontalAlign: 'right', verticalAlign: 'bottom'});

    group.position.set(node.x, node.y, node.z);
    if (node.rotate) {
        if (node.rotate.x) {
            group.applyMatrix4(new THREE.Matrix4().makeRotationX(node.rotate.x));
        }
        if (node.rotate.y) {
            group.applyMatrix4(new THREE.Matrix4().makeRotationY(node.rotate.y));
        }
        if (node.rotate.x) {
            group.applyMatrix4(new THREE.Matrix4().makeRotationZ(node.rotate.z));
        }
    }
    group.aid = node.id;
    node.box = size.r;
    node.expandLink = node.expandLink;
    node.expandView = node.expandView;

    return group;
}

export function view3D(element) {
    let data = {nodes: {}, links: []};

    let node = {
        id: element.shortname,
        name: element.name.replace(/\s/g, '\n'),
        view: create3D,
        fx: 0,
        fy: 0,
        fz: 0
    };

    data.nodes[element.shortname] = node;
    let i = 0;
    for (let j in element.scenarios) {
        let scenario = element.scenarios[j];
        let node = {
            id: scenario.uid,
            name: scenario.name.replace(/\s/g, '\n'),
        };
        data.nodes[node.id] = node;
        i++;
    }
    i = 0;
    for (let j in element.usecases) {
        let uc = element.usecases[j];
        let node = {
            id: j,
            name: uc.name.replace(/\s/g, '\n'),
            view: UseCase.get3DObject
        }
        data.nodes[j] = node;
        i++;
        data.links.push({source: element.shortname, target: j, value: 0.1});
        for (let k in uc.scenarios) {
            let id = `${j}.${k}`
            if (data.nodes.hasOwnProperty(id)) {
                data.links.push({source: j, target: id, value: 0.1});
            }
        }
    }
    i = 0;
    for (let j in element.workflows) {
        let wf = element.workflows[j];
        let node = {
            id: j,
            name: wf.name.replace(/\s/g, '\n'),
        }
        data.nodes[j] = node;
        i++;
        data.links.push({source: element.shortname, target: j, value: 0.1});
    }
    return data;
}

function _calculateBox(node) {
    let height = defaults.height;
    let width = defaults.width;
    let depth = defaults.depth;
    let radius = Math.max(Math.sqrt(width*width + height*height), Math.sqrt(height*height + depth*depth), Math.sqrt(width*width + depth*depth))/2;
    return {w: width, h: height, d: depth, r:radius};
}