import * as THREE from "three";
import AText from "$lib/AText.js";
import {UseCase} from "../UseCase";

const defaults = {fontSize: 20, height: 150, width: 100, depth: 20}

export function create3D(node, type) {
    let color = node.color || "#00bbaa";
    if (type === 'Selected') {
        color = "yellow";
    } else if (type === 'Targeted') {
        color = "red";
    } else if (type === 'Sourced') {
        color = "green";
    }
    let size = _calculateBox(node);
    let w = size.w;
    let h = size.h;
    let d = size.d;
    if (node.cube) {
        w = node.cube.x;
        h = node.cube.y;
        d = node.cube.z;
    }
    let opacity = node.opacity || 1;

    let geometry = new THREE.BoxGeometry(w, h, d);

    //const material = new THREE.MeshLambertMaterial({color: color, opacity: 1});
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
    retval.aid = node.id;
    // Find the Model Element and show it here.
    /*
    let objID = "#" + node.name + '3D';
    let aframeobj = document.querySelector(objID);
    if (!aframeobj) {
        aframeobj = document.querySelector('#default3D');
    }
    let obj3D = aframeobj.object3D.clone();

    // Make the obj3D larger based on the size of the width and height.
    obj3D.applyMatrix4(new THREE.Matrix4().makeScale(w / 100, w / 100, w / 100));
    obj3D.position.set(0, 0, (d / 2) + 10);
    retval.add(obj3D);
     */
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
    let label = AText.view3D({
        text: node.name.replace(/\s/g, '\n'),
        color: "#ffffff",
        parent: retval,
        verticalAlign: 'top',
        width: w,
        size: defaults.fontSize
    });
    node.box = node.box || size.r;
    return retval;
}

export function view3D(element) {
    const theta = Math.PI / 2; // 90 degrees
    let data = {nodes: {}, links: []};

    let model3d = {x: size.w, y: size.h, z: size.d};

    data.nodes[element.shortname] = {
        id: element.id,
        name: element.name,
        cube: model3d,
        description: element.description,
        opacity: 0.5,
        fx: 0,
        fy: 0,
        fz: 0,
        box: 0.1, // Prevents contention with the collide force.
        view: create3D,
        color: element.color
    };
    // Associations
    for (let aname in element.associations) {
        let assoc = element.associations[aname];
        let clsid = assoc.type;
        if (!data.nodes.hasOwnProperty(clsid)) {
            data.nodes[clsid] = {
                id: clsid,
                name: clsid,
                view: create3D,
                rbox: {
                    parent: element.id,
                    fx: -size.w / 2 - 20,
                    y: {min: -size.h / 2, max: size.h / 2},
                    z: {min: -size.d / 2, max: size.d / 2}
                },
                rotate: {y: -theta}
            };
        }
        data.nodes[`Assoc${clsid}`] = {
            id: `Assoc${clsid}`,
            location: {side: "top", parent: element.id},
            name: `${aname} : ${assoc.type}`,
            // view: AAttribute.view3D,
            color: 'magenta',
        };
        if (clsid !== cls.id) {
            data.links.push({target: clsid, source: `Assoc${clsid}`, width: 3.0, value: 10, color: '#ff00ff'});
        }
    }
    for (let iname in element.interface) {
        let name = iname.replace(element.prefix, '');
        let node = {
            location: {side: "top", parent: element.shortname},
            id: iname,
            name: name,
            description: element.interface[iname].description,
            // view: AInterface.view3D,
            // orientation: {x: 0, y: 2, z: 0}
        };
        data.nodes[iname] = node;
    }

    for (let hname in element.handlers) {
        let handler = element.handlers[hname];
        let node = {
            id: hname,
            name: handler.name,
            description: element.handlers[hname].description,
            location: {side: "right", parent: element.shortname},
            // view: AHandler.view3D,
        };

        data.nodes[hname] = node;
        for (let h in handler.handlers) {
            let hand = handler.handlers[h];
            if (hand.action) {
                let aname = hand.action.replace('/' + element.shortname, element.prefix);
                data.links.push({source: hname, target: aname, color: '#ffffbb', value: 0.1, width: 5});
            }
        }
    }

    for (let uname in element.usecases) {
        let uc = element.usecases[uname];

        let node = {
            id: uname, name: uc.name,
            location: {side: "bottom", parent: element.shortname},
            description: uc.description,
            fontSize: 15,
            view: UseCase.get3DObject,
            rotate: {x: theta},
            orientation: {x: 0, y: -1, z: 0}
        }
        data.nodes[uname] = node;
        if (uc.method) {
            data.links.push({
                source: uname,
                target: element.prefix + '/' + uc.method,
                color: '#ffffbb',
                value: 0.1,
                width: 5
            });
        }
    }

    for (let cname in element.classes) {
        let cls = element.classes[cname];
        let node = {
            id: cname, name: cls.name,
            description: cls.description,
            location: {side: "back", parent: element.shortname},
            // view: AModel.view3D,
        }
        data.nodes[cname] = node;
    }

    for (let pname in element.subpackages) {
        let selement = element.subpackages[pname];
        let node = {
            id: pname,
            location: {side: "left", parent: element.shortname},
            name: selement.name,
            description: selement.description,
            color: selement.color,
            view: create3D,
        }
        data.nodes[pname] = node;
    }

    for (let pname in element.depends) {
        let selement = element.depends[pname];
        let node = {
            id: pname,
            name: selement.name,
            description: selement.description,
            /*
            rbox: {
                parent: element.shortname,
                y: {min: bbox.y.max, max: bbox.y.max * 2},
                z: bbox.z,
                fx: bbox.x.min - 150,
            },
             */
            color: selement.color,
            rotate: {y: -theta},
            view: create3D,
            orientation: {x: -1, y: 0, z: 0}
        }
        data.nodes[pname] = node;
        data.links.push({source: element.shortname, target: pname, color: '#ffffbb', value: 1.0, width: 2});
    }
    return data;
}

function _calculateBox(node) {
    let fontSize = node.fontSize || defaults.fontSize;
    let name = node.name || node.id;
    let nameArray = name.split(/\s/).map(item => {
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

function _calculateGroupBox(items, fn) {
    let asize = {
        stats: {
            w: {sum: 0, max: 0},
            h: {sum: 0, max: 0},
            d: {sum: 0, max: 0},
            r: {sum: 0, max: 0},
            area: 0,
            num: 0,
        }, set: [],
        box: {w: 0, h: 0, d: 0, rows: 0, cols: 0},
    };

    for (let aname in items) {
        let size = fn({name: items[aname].name || aname});
        asize.set.push(size);
        asize.stats.w.sum += size.w;
        asize.stats.w.max = Math.max(size.w, asize.stats.w.max);
        asize.stats.d.sum += size.d;
        asize.stats.d.max = Math.max(size.d, asize.stats.d.max);
        asize.stats.h.sum += size.h;
        asize.stats.h.max = Math.max(size.h, asize.stats.h.max);
        asize.stats.r.sum += size.r;
        asize.stats.r.max = Math.max(size.w, asize.stats.r.max);
        asize.stats.area += size.w * size.h;
        asize.stats.num++;
    }
    asize.box.rows = Math.round(Math.sqrt(asize.stats.num) + 0.5);
    asize.box.cols = Math.round((asize.stats.num / asize.box.rows) + 0.5);
    asize.box.w = Math.max(Math.sqrt(asize.stats.area), asize.stats.r.max * asize.box.cols);
    asize.box.h = Math.max(Math.sqrt(asize.stats.area), asize.stats.r.max * asize.box.rows);
    return asize;
}

function _calculateDeepBox(package) {
    let ibox = _calculateGroupBox(package.interface, _calculateBox); // XZ
    let hbox = _calculateGroupBox(package.handlers, _calculateBox); // YZ
    let ubox = _calculateGroupBox(package.usecases, _calculateBox); // XY
    let cbox = _calculateGroupBox(package.classes, _calculateBox); // XY
    let pbox = _calculateGroupBox(package.subpackages, _calculateBox); // XZ
    let dbox = _calculateGroupBox(package.depends, _calculateBox); // YZ

    /* X is always the width, Y is height with X, Y is width with Z, Z is always h */
    let fontWidth = package.name.length * defaults.fontSize / 2;
    const wnum = Math.max(ibox.box.w, ubox.box.w, cbox.box.w, 100, fontWidth);
    const hnum = Math.max(hbox.box.w, ubox.box.h, cbox.box.h, dbox.box.h, pbox.box.h, 100);
    const dnum = Math.max(ibox.box.h, hbox.box.h, pbox.box.w, dbox.box.w, 100);

    const radius = Math.max(Math.sqrt(wnum ** 2 + hnum ** 2), Math.sqrt(hnum ** 2 + dnum ** 2), Math.sqrt(wnum ** 2 + dnum ** 2));
    return {
        w: wnum * 1.10, h: hnum * 1.10, d: dnum * 1.10, r: radius,
        interface: ibox,
        handlers: hbox,
        usecases: ubox,
        classes: cbox,
        subpackages: pbox,
        depends: dbox
    }
}
