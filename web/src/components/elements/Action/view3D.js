import * as THREE from "three";
import AText from "$lib/AText.js";

const defaults = {fontSize: 20, height: 20, width: 100, depth: 20};

export function create3D(node, type) {
    let opacity = node.opacity || 0.50;
    let fontSize = node.fontSize || defaults.fontSize;
    let color = node.color || "#0000aa";
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
    const group = new THREE.Group();
    let cobj = new THREE.CapsuleGeometry(height / 2, width, 4, 8);
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
    let capsule = new THREE.Mesh(cobj, material);
    capsule.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    group.add(capsule);

    let label = AText.view3D({text: node.name, color: "#ffffff", parent: group, width: width, size: fontSize});

    group.position.set(node.x, node.y, node.z);
    if (node.rotate) {
        if (node.rotate.x) {
            group.applyMatrix4(new THREE.Matrix4().makeRotationX(node.rotate.x));
        }
        if (node.rotate.y) {
            group.applyMatrix4(new THREE.Matrix4().makeRotationY(node.rotate.y));
        }
        if (node.rotate.z) {
            group.applyMatrix4(new THREE.Matrix4().makeRotationZ(node.rotate.z));
        }
    }
    group.aid = node.id;
    node.box = size.r;

    return group;
}

export function view3D(element) {
    let data = {nodes: {}, links: []};

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
    let depth = height * 2;
    let radius = Math.max(Math.sqrt(width * width + height * height), Math.sqrt(height * height + depth * depth), Math.sqrt(width * width + depth * depth)) / 2;

    return {w: width, h: height * 2, d: depth, r: radius};
}