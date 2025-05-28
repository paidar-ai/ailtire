import {forceManyBody, forceCenter} from 'd3-force-3d';
import {octree} from 'd3-octree';
import * as THREE from 'three';

export class Graph3D {
    static graph = null;
    constructor(graphRef, data, options) {
        Graph3D.graph = this;
        this.objects = {};
        this.links = {};
        this.options = {
            background: "#555500",
            linkColor: "#000000",
            linkDuplicate: true,
        }
        for (let i in options) {
            this.options[i] = options[i];
        }
        this.selected = {
            links: {
                target: new Set(),
                source: new Set()
            },
            nodes: {
                primary: null,
                source: {},
                target: {},
            }
        }

        if (options.expandObject) {
            this.expandObject = options.expandObject;
        }
        if (options.expandDesign) {
            this.expandDesign = options.expandDesign;
        }
        this.data = data;
        this.normalizeData();

        import('3d-force-graph')
            .then((module) => {
                this.graph = module.default({controlType: 'orbit'})
                (graphRef)
                    .graphData(this.ndata)
                    .backgroundColor(this.options.background)
                    .nodeVal((node) => {
                        return node.box || 20;
                    })
                    .nodeLabel(node => {
                        let label = node.name;
                        if (node.description) {
                            label = `<div style="background-color: rgba(0,0, 0, 0.7); padding: 5px; color: #ffffff;">` +
                                `<h2>${node.name}</h2><p>${node.description.replace(/\n/g, "<br/>")}</p></div>`;
                        }
                        return label;
                    })
                    .nodeThreeObject(node => {
                        let type = "";
                        if (this.selected.nodes.primary === node) {
                            type += "Selected";
                        } else if (this.selected.nodes.target.hasOwnProperty(node.id)) {
                            type += "Targeted";
                        } else if (this.selected.nodes.source.hasOwnProperty(node.id)) {
                            type += "Sourced";
                        }
                        let retval = null;
                        if (typeof node.view === 'function') {
                            retval = node.view(node, type);
                        } else {
                            retval = defaultObject(node, type);
                        }
                        node.rendered = true;
                        return retval;
                    })

                    .linkCurvature(link => {
                        if (link.source === link.target) {
                            return 1;
                        }
                        if (link.curve) {
                            return link.curve;
                        }
                        return 0;
                    })
                    .linkWidth(link => {
                        let width = link.width || 1;
                        if (this.selected.links.target.has(link)) {
                            return (width + 1) * 2;
                        } else if (this.selected.links.source.has(link)) {
                            return (width + 1) * 2;
                        }
                        return width;
                    })
                    .linkOpacity(1.0)
                    .linkDirectionalArrowRelPos(link => {
                        return link.relpos;
                    })
                    .linkDirectionalArrowLength(link => {
                        if (link.arrow) {
                            return link.arrow;
                        }
                        return 0;
                    })
                    .linkThreeObjectExtend(true)
                    .linkThreeObject(link => {
                        // extend link with text sprite
                        if (link.name) {
                            // let sprite = AText.view3D({text: link.name, color: "#dddddd", width: 100, size: 10});
                            // sprite.name = link.name;
                            // return sprite;
                            return link.name;
                        }
                        return null;

                    })
                    .linkPositionUpdate((sprite, {start, end}) => {
                        if (sprite) {
                            let ax = Math.abs(start.x - end.x);
                            let ay = Math.abs(start.y - end.y);
                            let az = Math.abs(start.z - end.z);
                            if (ay > ax && ay > az) {
                                sprite.oriented = "YX";
                                if (az > ax) {
                                    if (sprite.oriented != "YZ") {
                                        sprite.oriented = "YZ";
                                        sprite.setRotationFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
                                    }
                                }
                            } else if (ax > ay && ax > az) {
                                if (az > ay) {
                                    if (sprite.oriented != "XZ") {
                                        sprite.oriented = "XZ";
                                        sprite.setRotationFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI / 2, "XYZ"));
                                    }
                                } else if (sprite.oriented != "XY") {
                                    sprite.oriented = "XY";
                                    sprite.setRotationFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
                                }
                            } else if (az > ax && az > ay) {
                                if (ax > ay) {
                                    if (sprite.oriented != "ZX") {
                                        sprite.oriented = "ZX";
                                        sprite.setRotationFromEuler(new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"));
                                    }
                                } else if (sprite.oriented != "ZY") {
                                    sprite.oriented = "ZY";
                                    sprite.setRotationFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
                                }
                            }
                            if (sprite.lcurve) {
                                const dx = end.x - start.x;
                                const dy = end.y - start.u || 0;
                                let vLine = new THREE.Vector3().subVectors(end, start);
                                let cp = vLine.clone().multiplyScalar(sprite.lcurve / 2).cross(dx !== 0 || dy !== 0 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0))
                                    .add(new THREE.Vector3().addVectors(start, end).divideScalar(2));
                                Object.assign(sprite.position, cp);
                            } else {
                                const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
                                    [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                                })));
                                // Position sprite
                                Object.assign(sprite.position, middlePos);
                            }
                        }
                    })
                    .linkDirectionalParticles(link => {
                        let width = link.width || 1;
                        if (this.selected.links.target.has(link)) {
                            return (width + 1) * 4;
                        } else if (this.selected.links.source.has(link)) {
                            return (width + 1) * 4;
                        }
                        return width * 2;
                    })
                    .linkDirectionalParticleColor(link => {
                        if (this.selected.links.target.has(link)) {
                            return "#ff0000";
                        } else if (this.selected.links.source.has(link)) {
                            return "#ffff00";
                        }
                        if (link.color) {
                            return link.color;
                        }
                        return this.options.linkColor;
                    })
                    .linkDirectionalParticleWidth(link => {
                        let width = link.width || 2;
                        if (this.selected.links.target.has(link)) {
                            return (width + 1) * 4;
                        } else if (this.selected.links.source.has(link)) {
                            return (width + 1) * 4;
                        }
                        return width * 2;
                    })
                    .linkColor(link => {
                        if (link.color) {
                            return link.color;
                        } else {
                            return "gray";
                        }
                        if (this.selected.links.target.has(link)) {
                            return "#ffaaaa";
                        } else if (this.selected.links.source.has(link)) {
                            return "#ffffaa";
                        }
                    })
                    .cooldownTime(5000)
                    .linkDirectionalParticleSpeed(0.006)
                    .enableNodeDrag(true)
                    .graphData(this.ndata)
                    .onNodeClick(node => {
                        this.selectNode(node);
                    })
                    .onNodeRightClick(node => {
                        if (this.expandObject) {
                            if (node.expandLink) {
                                // This is a design element.
                                this.expandDesign(node);
                            } else {
                                this.expandObject(`${node.group}?id=${node.id}`);
                            }
                        }
                    })
                    .dagLevelDistance(300);
                /*this.linkForce = this.graph
                    .d3Force('link')
                    .distance(link => link.value * 10);
                 */
                this.graph
                    .d3Force('charge', forceManyBody().strength((d) => {
                        return 40;
                    }))
                    .d3Force("center", forceCenter().strength((d) => {
                        if (d.rbox) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }))
                    .d3Force('collide', Graph3D.collide()
                        .radius((d) => {
                            if (d.box && typeof d.box === 'number') {
                                return d.box * 2;
                            } else {
                                return 20;
                            }
                        })
                    )
                    .d3Force('plane', Graph3D.forceOnPlane());

                this.graph.numDimensions(3);
                /*
                const light1 = new THREE.PointLight(0xffffff, 0.2);
                light1.position.set(-1000,1000,2000);
                window.graph.graph.scene().add(light1);
                const light2 = new THREE.PointLight(0xffffff, 0.2);
                light2.position.set(1000,500,2000);
                window.graph.graph.scene().add(light2);
                 */

                this.graph.onEngineStop(() => this.graph.zoomToFit(400));
            })
            .catch(err => {
                console.error(err);
            });

    };

    static forceOnPlane() {
        function constant(_) {
            return () => _;
        }

        function index(d) {
            return d.index;
        }

        var id = index,
            nodes = [],
            nmap = {};

        function force(alpha) {
            for (let i = 0, n = nodes.length, k = alpha * 0.1; i < n; ++i) {
                let node = nodes[i];
                if (node.fx) {
                    node.x = node.fx;
                    node.vx = 0;
                }
                if (node.fy) {
                    node.y = node.fy;
                    node.vy = 0;
                }
                if (node.fz) {
                    node.z = node.fz;
                    node.vz = 0;
                }
                if (node.location) {
                    if (node.location.parent) {
                        let parentNode = nodes[nmap[node.location.parent]];
                        let children = nodes.filter(c => c.location?.parent === node.location.parent);

                        // Check that all of the children have the rendered attribute set to true.
                        if (children.every(child => child.rendered)) {
                            _calculateBoxFromChildren(parentNode, children);
                        }
                    }
                }
                if (node.rbox) {
                    let parent = nodes[nmap[node.rbox.parent]];
                    if (parent) { // the Parent is found then go forward. If not then don't.
                        _applyRotationAndPosition(node, parent);
                    }
                }

                if (node.bbox) {
                    if (node.bbox.x) {
                        let newx = node.x + node.vx;
                        if (newx < node.bbox.x.min) {
                            node.x = node.bbox.x.min;
                            node.vx = -node.vx * k;
                        } else if (newx > node.bbox.x.max) {
                            node.x = node.bbox.x.max;
                            node.vx = -node.vx * k;
                        }
                    }
                    if (node.bbox.y) {
                        let newy = node.y + node.vy;
                        if (newy < node.bbox.y.min) {
                            node.y = node.bbox.y.min;
                            node.vy = -node.vy * k;
                        } else if (newy > node.bbox.y.max) {
                            node.y = node.bbox.y.max;
                            node.vy = -node.vy * k;
                        }
                    }
                    if (node.bbox.z) {
                        let newz = node.z + node.vz;
                        if (newz < node.bbox.z.min) {
                            node.z = node.bbox.z.min;
                            node.vz = -node.vz * k;
                        } else if (newz > node.bbox.z.max) {
                            node.z = node.bbox.z.max;
                            node.vz = -node.vz * k;
                        }
                    }
                }
            }
        }

        function initialize() {
        }

        force.initialize = function (_) {
            nodes = _;
            for (let i in nodes) {
                nmap[nodes[i].id] = i;
            }
            initialize();
        };

        force.strength = function (x) {
            let strength = force.strength();
            if (!arguments.length) return strength;
            strength = x;
            return force;
        };

        force.id = function (_) {
            return arguments.length ? ((id = _), force) : id;
        };

        force.nodes = function (_) {
            return arguments.length ? ((nodes = _), force) : nodes;
        };

        return force;
    }

    static collide(radius) {
        let nodes,
            groups,
            nDim,
            radii,
            random,
            strength = 1,
            iterations = 1;

        function constant(_) {
            return () => _;
        }

        function jiggle(random) {
            return (random() - 0.5) * 1e-6;
        }

        function x$2(d) {
            return d.x + d.vx;
        }

        function y$2(d) {
            return d.y + d.vy;
        }

        function z$2(d) {
            return d.z + d.vz;
        }

        if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

        function force() {
            let i, n = nodes.length,
                tree,
                node,
                xi,
                yi,
                zi,
                ri,
                ri2;

            for (var k = 0; k < iterations; ++k) {
                for (let g in groups) {
                    let group = groups[g];
                    radii = group.radii;
                    tree = octree(group.nodes, x$2, y$2, z$2).visitAfter(prepare);

                    for (i = 0; i < group.nodes.length; ++i) {
                        node = group.nodes[i];
                        ri = radii[node.index];
                        ri2 = ri * ri;
                        xi = node.x + node.vx;
                        yi = node.y + node.vy;
                        zi = node.z + node.vz;
                        tree.visit(apply);
                    }
                }
            }

            function apply(treeNode, arg1, arg2, arg3, arg4, arg5, arg6) {
                var args = [arg1, arg2, arg3, arg4, arg5, arg6];
                var x0 = args[0],
                    y0 = args[1],
                    z0 = args[2],
                    x1 = args[nDim],
                    y1 = args[nDim + 1],
                    z1 = args[nDim + 2];

                var data = treeNode.data, rj = treeNode.r, r = ri + rj;
                if (data) {
                    if (data.index > node.index) {
                        // x,y,z is the distance between the two nodes.
                        let x = xi - data.x - data.vx;
                        let y = yi - data.y - data.vy;
                        let z = zi - data.z - data.vz;
                        let l = x * x + y * y + z * z;
                        // Distance between the two nodes.
                        if (l < r * r) {
                            if (x === 0) x = jiggle(random), l += x * x;
                            if (y === 0) y = jiggle(random), l += y * y;
                            if (z === 0) z = jiggle(random), l += z * z;
                            l = (r - (l = Math.sqrt(l))) / l * strength;

                            node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
                            node.vy += (y *= l) * r;
                            node.vz += (z *= l) * r;

                            data.vx -= x * (r = 1 - r);
                            data.vy -= y * r;
                            data.vz -= z * r;

                        }
                    }
                    return;
                }
                return x0 > xi + r || x1 < xi - r
                    || (nDim > 1 && (y0 > yi + r || y1 < yi - r))
                    || (nDim > 2 && (z0 > zi + r || z1 < zi - r));
            }
        }

        function prepare(treeNode) {
            if (treeNode.data) return treeNode.r = radii[treeNode.data.index];
            for (var i = treeNode.r = 0; i < Math.pow(2, nDim); ++i) {
                if (treeNode[i] && treeNode[i].r > treeNode.r) {
                    treeNode.r = treeNode[i].r;
                }
            }
        }

        function initialize() {
            if (!nodes) return;
            groups = {};
            // Segment the nodes into groups and calcuate the radius for all.
            for (let i in nodes) {
                let node = nodes[i];
                if (node.universe) {
                    if (!groups.hasOwnProperty(node.universe)) {
                        groups[node.universe] = {radii: [], nodes: []};
                    }
                    groups[node.universe].nodes.push(node);
                } else {
                    if (!groups.hasOwnProperty("NONE")) {
                        groups.NONE = {radii: [], nodes: []};
                    }
                    groups.NONE.nodes.push(node);
                }
            }

            for (let g in groups) {
                let group = groups[g];
                let n = group.nodes.length;
                for (let i = 0; i < group.nodes.length; ++i) {
                    let node = group.nodes[i]
                    group.radii[node.index] = +radius(node, i, group.nodes);
                }
            }
        }

        force.initialize = function (_nodes, ...args) {
            nodes = _nodes;
            random = args.find(arg => typeof arg === 'function') || Math.random;
            nDim = args.find(arg => [1, 2, 3].includes(arg)) || 2;
            initialize();
        };

        force.iterations = function (_) {
            return arguments.length ? (iterations = +_, force) : iterations;
        };

        force.strength = function (_) {
            return arguments.length ? (strength = +_, force) : strength;
        };

        force.radius = function (_) {
            return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
        };

        return force;
    }

    addObject(obj) {
        this.objects[obj.aid] = obj;
        this.graph.scene().add(obj);
    }

    addLink(link) {
        if (link.id) {
            this.links[link.id] = link;
        } else {
            this.links[link.source + link.target] = link;
        }
    }

    showLinks() {
        for (let id in this.links) {
            let link = this.links[id];
            let source = this.objects[link.source];
            let target = this.objects[link.target];
            if (source && target) {
                const color = link.color || 0xaaaaaa;
                const material = new THREE.LineBasicMaterial({color: color});
                const points = [];
                points.push(new THREE.Vector3(source.position.x, source.position.y, source.position.z));
                points.push(new THREE.Vector3(target.position.x, target.position.y, target.position.z));
                const geo = new THREE.BufferGeometry().setFromPoints(points);
                const linkObj = new THREE.Line(geo, material);
                // Add the links as objects to the graph
                this.objects[id] = linkObj;
                this.graph.scene().add(linkObj);
            }
        }
    }

    clearObjects() {
        for (let i in this.objects) {
            this.graph.scene().remove(this.objects[i]);
        }
        this.objects = {};
        this.links = {};
    }

    normalizeData() {
        this.ndata = {
            links: [],
            nodes: []
        };
        let linkmap = {};
        // Cleanup links to non-objects
        // If multiple links between objects change the curve.
        let k = 0;
        for (let i in this.data.links) {
            let source = this.data.links[i].source;
            let target = this.data.links[i].target;
            let found = true;
            if (typeof source === 'string') {
                if (!this.data.nodes.hasOwnProperty(source)) {
                    console.error("Could not find the Source Node:", source);
                    found = false;
                } else {
                    source = this.data.nodes[source];
                }
            }
            if (typeof target === 'string') {
                if (!this.data.nodes.hasOwnProperty(target)) {
                    console.error("Could not find the Target Node:", target);
                    found = false;
                } else {
                    target = this.data.nodes[target];
                }
            }
            if (found) {
                this.ndata.links.push(this.data.links[i]);
                if (!linkmap.hasOwnProperty(source.id + target.id)) {
                    linkmap[source.id + target.id] = [];
                }
                linkmap[source.id + target.id].push(k);
                k++;
            }
        }
        for (let ni in linkmap) {
            let litem = linkmap[ni];
            if (litem.length > 1) {
                let curve = -litem.length / 2 * 0.2;
                for (let i in litem) {
                    let lid = litem[i];
                    this.ndata.links[lid].curve = curve;
                    curve += 0.2;
                }
            }
        }
        // Reset the links array if the links are not duplicated based on the options.
        if (!this.options.linkDuplicate) {
            let newLinks = [];
            for (let i in linkmap) {
                let link = this.ndata.links[linkmap[i][0]];
                newLinks.push(link);
            }
            this.ndata.links = newLinks;
        }
        for (let i in this.data.nodes) {
            this.ndata.nodes.push(this.data.nodes[i]);
        }
        return;
    };

    setDuplicateLink(flag) {
        this.options.linkDuplicate = flag;
    };

    setData(pNodes, pLinks) {
        this.data.nodes = pNodes;
        this.data.links = pLinks;
        this.normalizeData(); // Creates the ndata. Normalizedd Data
        this.graph.graphData(this.ndata);
    };

    // Add the data if it exists then update the data node.
    updateData(pNodes, pLinks) {
        for (let i in pNodes) {
            this.data.nodes[i] = pNodes[i];
        }
        for (let i in pLinks) {
            this.data.links.push(pLinks[i]);
        }
        this.normalizeData();
        this.graph.graphData(this.ndata);
    };

    addData(pNodes, pLinks) {
        if (!this.data.nodes) {
            this.data.nodes = {};
        }
        for (let i in pNodes) {
            if (!this.data.nodes.hasOwnProperty(i)) {
                this.data.nodes[i] = pNodes[i];
            }
        }
        for (let i in pLinks) {
            if (!this.data.links) {
                this.data.links = [];
            }
            this.data.links.push(pLinks[i]);
        }
        this.normalizeData();
        this.graph.graphData(this.ndata);
    };

    selectNode(node) {
        this.unSelectNodes();
        this.selected.nodes.primary = node;
        if (node) {
            // select the element in the list.
            // This should be done with a callback for the select.
            if (this.options.selectCallback) {
                this.options.selectCallback(node);
            }
            this.selectRelNodes(node, "source", 1);
            this.selectRelNodes(node, "target", 1);
        }
        this.graph
            .nodeThreeObject(this.graph.nodeThreeObject())
            .linkWidth(this.graph.linkWidth())
            .linkDirectionalParticles(this.graph.linkDirectionalParticles());
    };

    selectNodeByID(id, graphOnly) {
        if (this.data.nodes.hasOwnProperty(id)) {
            let node = this.data.nodes[id]
            if (!graphOnly) {
                this.selectNode(this.data.nodes[id]);
            }
            if (node) {
                // Aim at node from outside it
                const box = new THREE.Box3().setFromObject(node.__threeObj);
                for (let i in this.selected.nodes.source) {
                    let object = this.selected.nodes.source[i].__threeObj;
                    box.expandByObject(object);
                }
                const size = new THREE.Vector3();
                box.getSize(size); // Get the size of the object
                const camera = this.graph.camera();
                // Optional: Move the camera farther away so the object fits in the view
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180); // Convert vertical FOV to radians
                const cameraDistance = 1.2 * (maxDim / (2 * Math.tan(fov / 2))); // Distance required to fit object
                // const distRatio = 10 * box;
                // Get the Bounding Box
                if (!node.orientation) {
                    node.orientation = {x: 0, y: 0, z: 1};
                }
                this.graph.cameraPosition({
                        x: node.x + (cameraDistance * node.orientation.x),
                        y: node.y + (cameraDistance * node.orientation.y),
                        z: node.z + (cameraDistance * node.orientation.z)
                    }, // new position
                    node, // lookAt ({ x, y, z })
                    3000  // ms transition duration.
                );
            }
        }
    };

    unSelectNodes() {
        if (this.selected.nodes.primary) {
            let element = document.getElementById(this.selected.nodes.primary.id);
            if (element) {
                element.className = "";
            }
        }
        this.selected = {
            links: {
                target: new Set(),
                source: new Set()
            },
            nodes: {
                primary: null,
                source: {},
                target: {},
            }
        }
    };

    selectRelNodes(node, direction, levels) {
        let bdir = "target";
        if (direction === "target") {
            bdir = "source";
        }
        // Check if I have already processed this node.
        if (this.selected.nodes.source.hasOwnProperty(node.id)) {
            return;
        }
        // Check if I have already processed this node.
        if (this.selected.nodes.target.hasOwnProperty(node.id)) {
            return;
        }
        let myNodes = [];
        for (let i in this.data.links) {
            let link = this.data.links[i];
            if (link[bdir].id === node.id) {
                this.selected.links[bdir].add(link);
                if (this.data.nodes.hasOwnProperty(link[direction].id)) {
                    let nnode = this.data.nodes[link[direction].id];
                    if (nnode.hasOwnProperty('parentObject')) {
                        this.selectRel(nnode.parentObject, direction, levels);
                    }
                    this.selected.nodes[bdir][nnode.id] = nnode;
                    this.selectRelNodes(nnode, direction, levels);
                }
            }
        }
    };

    getSelectedNode() {
        return this.selected.nodes.primary;
    };

    setNode(nodeid, opts) {
        let node = this.data.nodes[nodeid];
        if (node) {
            for (let name in opts) {
                node[name] = opts[name];
            }
        }
        this.selectNode(this.data.nodes[nodeid]);
    };

    setNodeAndFocus(nodeid, opts) {
        let node = this.data.nodes[nodeid];
        if (node) {
            for (let name in opts) {
                node[name] = opts[name];
            }
        }
        this.selected.nodes.primary = node;
        if (node) {
            const box = new THREE.Box3().setFromObject(node.__threeObj);
            for (let i in this.selected.nodes.source) {
                let object = this.selected.nodes.source[i].__threeObj;
                box.expandByObject(object);
            }
            const size = new THREE.Vector3();
            box.getSize(size); // Get the size of the object
            const camera = this.graph.camera();
            // Optional: Move the camera farther away so the object fits in the view
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180); // Convert vertical FOV to radians
            const cameraDistance = 1.2 * (maxDim / (2 * Math.tan(fov / 2))); // Distance required to fit object
            // const distRatio = 10 * box;
            // Get the Bounding Box
            if (!node.orientation) {
                node.orientation = {x: 0, y: 0, z: 1};
            }
            this.graph.cameraPosition({
                    x: node.x + (cameraDistance * node.orientation.x),
                    y: node.y + (cameraDistance * node.orientation.y),
                    z: node.z + (cameraDistance * node.orientation.z)
                }, // new position
                node, // lookAt ({ x, y, z })
                500  // ms transition duration.
            );
        }
    }

    showSelectedOnly() {
        let selectedNodes = this.selected.nodes;
        let selectedLinks = this.selected.links;
        // this.clearObjects()
        let nodes = {};
        nodes[selectedNodes.primary.id] = selectedNodes.primary;
        for (let si in selectedNodes.source) {
            nodes[si] = selectedNodes.source[si];
        }
        for (let ti in selectedNodes.target) {
            nodes[ti] = selectedNodes.target[ti];
        }
        let links = [];
        selectedLinks.source.forEach((link) => {
            links.push(link);
        });
        selectedLinks.target.forEach((link) => {
            links.push(link);
        });
        this.data.nodes = nodes;
        this.data.links = links;
        this.normalizeData(); // Creates the ndata. Normalized Data
        this.graph.graphData(this.ndata);
    }

}

function _applyRotationAndPosition(node, parent) {
    // Ensure the parent's rotation values are set, defaulting to 0
    let rx = parent.rotate?.x || 0; // Rotation around x-axis (in radians)
    let ry = parent.rotate?.y || 0; // Rotation around y-axis (in radians)
    let rz = parent.rotate?.z || 0; // Rotation around z-axis (in radians)

    // Provide defaults for node dimensions if they are missing
    let nodeWidth = node.width || 1; // Default width of 1 if undefined
    let nodeHeight = node.height || 1; // Default height of 1 if undefined
    let nodeDepth = node.depth || 1; // Default depth of 1 if undefined

    // Calculate default relative positions
    let relativeX = node.rbox?.fx ?? node.rbox?.x?.min ?? -nodeWidth / 2;
    let relativeY = node.rbox?.fy ?? node.rbox?.y?.min ?? -nodeHeight / 2;
    let relativeZ = node.rbox?.fz ?? node.rbox?.z?.min ?? -nodeDepth / 2;

    // Safely handle `rbox` bounds if defined
    if (node.rbox) {
        // Handle clamping for the x-axis
        if (node.rbox.x) {
            let minX = parent.x + (node.rbox.x?.min || 0);
            let maxX = parent.x + (node.rbox.x?.max || 0);

            if (node.x <= minX) {
                relativeX = node.rbox.x.min || relativeX;
                node.vx = Math.abs(node.vx || 0); // Bounce back to the right
            } else if (node.x >= maxX) {
                relativeX = node.rbox.x.max || relativeX;
                node.vx = -(Math.abs(node.vx || 0)); // Bounce back to the left
            }
        }

        // Handle clamping for the y-axis
        if (node.rbox.y) {
            let minY = parent.y + (node.rbox.y?.min || 0);
            let maxY = parent.y + (node.rbox.y?.max || 0);

            if (node.y <= minY) {
                relativeY = node.rbox.y.min || relativeY;
                node.vy = Math.abs(node.vy || 0); // Bounce upward
            } else if (node.y >= maxY) {
                relativeY = node.rbox.y.max || relativeY;
                node.vy = -(Math.abs(node.vy || 0)); // Bounce downward
            }
        }

        // Handle clamping for the z-axis
        if (node.rbox.z) {
            let minZ = parent.z + (node.rbox.z?.min || 0);
            let maxZ = parent.z + (node.rbox.z?.max || 0);

            if (node.z <= minZ) {
                relativeZ = node.rbox.z.min || relativeZ;
                node.vz = Math.abs(node.vz || 0); // Bounce forward
            } else if (node.z >= maxZ) {
                relativeZ = node.rbox.z.max || relativeZ;
                node.vz = -(Math.abs(node.vz || 0)); // Bounce backward
            }
        }
    }

    // Apply rotations (X → Y → Z in order)
    // Rotate around the X-axis
    let y1 = relativeY * Math.cos(rx) - relativeZ * Math.sin(rx);
    let z1 = relativeY * Math.sin(rx) + relativeZ * Math.cos(rx);

    // Rotate around the Y-axis
    let x2 = relativeX * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -relativeX * Math.sin(ry) + z1 * Math.cos(ry);

    // Rotate around the Z-axis
    let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

    // Compute the final position relative to the parent
    let finalX = parent.x + x3;
    let finalY = parent.y + y3;
    let finalZ = parent.z + z2;

    // Update the node's final position
    node.x = finalX;
    node.y = finalY;
    node.z = finalZ;

    // Fix positions (if explicitly defined in rbox)
    if (node.rbox?.fx !== undefined) {
        node.fx = finalX; // Lock x-coordinate if `fx` is defined
    }
    if (node.rbox?.fy !== undefined) {
        node.fy = finalY; // Lock y-coordinate if `fy` is defined
    }
    if (node.rbox?.fz !== undefined) {
        node.fz = finalZ; // Lock z-coordinate if `fz` is defined
    }
}

const defaultObject = ((node, type) => {
    let color = node.color || 0xaaaaaa;
    if (type === 'Sourced') {
        color = 0x0000ff;
    } else if (type === 'Targeted') {
        color = 0xff0000;
    } else if (type === 'Selected') {
        color = 0xffff00;
    }
    const shape = new THREE.SphereGeometry(5);
    const material = new THREE.MeshBasicMaterial({color: color});
    return new THREE.Mesh(shape, material);
});

function _calculateBoxFromChildren(parent, children) {
    if(!parent.childrenRendered) {
        // Step 1: Calculate the parent box size
        const cubeSize = _calculateBoxSize(children);

        const bbox = new THREE.Box3();
        bbox.setFromObject(parent.__threeObj);
        const currentSize = bbox.getSize(new THREE.Vector3());
        // Step 2: Update the parent node's 3D object dimensions (geometry)
        let cube = {};
        cube.width = Math.max(cubeSize.width, (bbox.max.x - bbox.min.x));
        cube.height = Math.max(cubeSize.height, (bbox.max.y - bbox.min.y));
        cube.depth = Math.max(cubeSize.depth, (bbox.max.z - bbox.min.z));
        parent.cube = {x: cube.width, y: cube.height, z: cube.depth};

        const scale = {
            x: parent.cube.x / currentSize.x,
            y: parent.cube.y / currentSize.y,
            z: parent.cube.z / currentSize.z
        };

            setTimeout(() => {
                Graph3D.graph.selectNode(parent);
                Graph3D.graph.unSelectNodes();
                /*
                parent.__threeObj.parent.remove(parent.__threeObj);
                parent.__threeObj = parent.view(parent);
                parent.__threeObj.position.set(parent.x, parent.y, parent.z);
                Graph3D.graph.scene().add(parent.__threeObj);
                console.log(Graph3D.graph.scene().children);
                Graph3D.graph.refresh();
                 */

            }, 3000);
        // Step 3: Place children nodes on the cube sides
        _placeNodesOnCube(children, cube);
        parent.childrenRendered = true;
    }
}

function _calculateBoxSize(children, padding = 10) {
    // Initialize size for each side
    const sideSizes = {
        top: {width: 0, height: 0},
        bottom: {width: 0, height: 0},
        left: {width: 0, height: 0},
        right: {width: 0, height: 0},
        front: {width: 0, height: 0},
        back: {width: 0, height: 0},
    };

    // Group children by side
    const groupedBySide = _groupBySide(children);

    Object.entries(groupedBySide).forEach(([side, nodes]) => {
        // Arrange nodes in a grid and calculate size for this side
        let {gridWidth, gridHeight} = _calculateGridSize(nodes, padding);

        if (side === 'top' || side === 'bottom') {
            // X-Z plane: width -> X, height -> Z (affects width and depth)
            sideSizes[side] = {width: gridWidth, height: gridHeight};
        } else if (side === 'left' || side === 'right') {
            // Y-Z plane: width -> Z, height -> Y (affects depth and height)
            sideSizes[side] = {width: gridWidth, height: gridHeight};
        } else if (side === 'front' || side === 'back') {
            // X-Y plane: width -> X, height -> Y (affects width and height)
            sideSizes[side] = {width: gridWidth, height: gridHeight};
        }
    });

    // Final cube dimensions
    const width = Math.max(sideSizes.top.width, sideSizes.bottom.width, sideSizes.front.width, sideSizes.back.width);
    const height = Math.max(sideSizes.left.height, sideSizes.right.height, sideSizes.front.height, sideSizes.back.height);
    const depth = Math.max(sideSizes.top.height, sideSizes.bottom.height, sideSizes.left.width, sideSizes.right.width);

    return {width: width + padding, height: height + padding, depth: depth + padding};
}

function _groupBySide(children) {
    const grouped = {top: [], bottom: [], left: [], right: [], front: [], back: []};
    children.forEach(child => {
        if (child.location && child.location.side) {
            grouped[child.location.side].push(child);
        }
    });
    return grouped;
}

function _calculateGridSize(nodes, padding) {
    let totalWidth = 0, totalHeight = 0;
    let currentRowWidth = 0, maxRowWidth = 0;
    let currentRowHeight = 0;

    nodes.forEach(node => {
        if (!node.size) {
            node.size = _calculateNodeSize(node);
        }
        const nodeWidth = node.size.width + padding;
        const nodeHeight = node.size.height + padding;

        // Check if the node can fit in the current row
        if (currentRowWidth + nodeWidth > maxRowWidth) {
            // Start a new row
            totalHeight += currentRowHeight; // Add the current row's height to total height
            currentRowWidth = 0; // Reset row width
            currentRowHeight = 0; // Reset row height
        }

        // Add the node to the current row
        currentRowWidth += nodeWidth;
        currentRowHeight = Math.max(currentRowHeight, nodeHeight);

        // Track the maximum width of any row
        maxRowWidth = Math.max(maxRowWidth, currentRowWidth);
    });

    // Add the height of the final row
    totalHeight += currentRowHeight;

    return {gridWidth: maxRowWidth, gridHeight: totalHeight};
}

function _placeNodesOnCube(children, cubeSize, padding = 10) {

    // Helper function to calculate the grid placement for nodes on a specific side
    function calculateGridPositions(nodes, maxWidth, maxHeight) {
        const positions = [];
        const n = nodes.length;

        // Calculate the number of rows and columns for a balanced grid
        const columns = Math.ceil(Math.sqrt(n)); // At least this many columns
        const rows = Math.ceil(n / columns);     // Calculate rows needed

        // Calculate cell dimensions (space available per node)
        const cellWidth = maxWidth / columns;
        const cellHeight = maxHeight / rows;

        let row = 0, col = 0; // Initialize row and column counters

        nodes.forEach((node, index) => {
            // Dynamically calculate node size if not defined
            if (!node.size) {
                node.size = _calculateNodeSize(node);
            }

            const nodeWidth = node.size.width;
            const nodeHeight = node.size.height;

            // Calculate the node's position in its cell
            const x = -maxWidth / 2 + col * cellWidth + cellWidth / 2;
            const y = maxHeight / 2 - row * cellHeight - cellHeight / 2;

            // Account for padding (center nodes within the cell with padding)
            const adjustedX = x - nodeWidth / 2 + padding;
            const adjustedY = y - nodeHeight / 2 - padding;

            // Save position
            positions.push({ node: node, x: adjustedX, y: adjustedY });

            // Update column and row
            col++;
            if (col >= columns) {
                col = 0;  // Reset column
                row++;    // Move to the next row
            }
        });

        return positions;
    }

    // X-Z grid on the top (Y fixed at height / 2)
    let positions = calculateGridPositions(
        children.filter(c => c.location.side === 'top'),
        cubeSize.width,
        cubeSize.depth
    );
    positions.forEach((pos, i) => {
        const childNode = pos.node;
        assignAttributes(childNode, pos.x, cubeSize.height / 2, pos.y,
            {x: 0, y: 1, z: 0}, {x: -Math.PI / 2, y: 0, z: 0}); // No rotation for top
    });

    // X-Z grid on the bottom (Y fixed at -height / 2)
    positions = calculateGridPositions(
        children.filter(c => c.location.side === 'bottom'),
        cubeSize.width,
        cubeSize.depth
    );
    positions.forEach((pos, i) => {
        const childNode = pos.node;
        assignAttributes(childNode, pos.x, -cubeSize.height / 2, pos.y,
            {x: 0, y: -1, z: 0}, {x: Math.PI / 2, y: 0, z: 0}); // Flip upside down for bottom
    });

    // Y-Z grid on the left side (X fixed at -width / 2)
    positions = calculateGridPositions(
        children.filter(c => c.location.side === 'left'),
        cubeSize.depth,
        cubeSize.height
    );
    positions.forEach((pos, i) => {
        const childNode = pos.node;
        assignAttributes(childNode, -cubeSize.width / 2, pos.y, pos.x,
            {x: -1, y: 0, z: 0}, {x: 0, y: -Math.PI / 2, z: 0}); // Rotate -90° around Y
    });

    // Y-Z grid on the right side (X fixed at +width / 2)
    positions = calculateGridPositions(
        children.filter(c => c.location.side === 'right'),
        cubeSize.depth,
        cubeSize.height
    );
    positions.forEach((pos, i) => {
        const childNode = pos.node;
        assignAttributes(childNode, cubeSize.width / 2, pos.y, pos.x,
            {x: 0, y: 1, z: 0}, {x: 0, y: Math.PI / 2, z: 0}); // Rotate +90° around Y
    });

    // X-Y grid on the front side (Z fixed at depth / 2)
    positions = calculateGridPositions(
        children.filter(c => c.location.side === 'front'),
        cubeSize.width,
        cubeSize.height
    );
    positions.forEach((pos, i) => {
        const childNode = pos.node;
        assignAttributes(childNode, pos.x, pos.y, cubeSize.depth / 2,
            {x: 0, y: 0, z: 1}, {x: 0, y: 0, z: 0}); // Orientation and rotation for front
    });

    // X-Y grid on the back side (Z fixed at -depth / 2)
    positions = calculateGridPositions(
        children.filter(c => c.location.side === 'back'),
        cubeSize.width,
        cubeSize.height
    );
    positions.forEach((pos, i) => {
        const childNode = pos.node;
        assignAttributes(childNode, pos.x, pos.y, -cubeSize.depth / 2,
            {x: 0, y: 0, z: -1}, {x: 0, y: Math.PI, z: 0}); // Rotate 180° around Y
    });

    // Helper function to assign attributes to a child node
    function assignAttributes(node, fx, fy, fz, orientation, rotation) {
        node.fx = fx;
        node.fy = fy;
        node.fz = fz;
        node.orientation = orientation;
        node.rotation = rotation;
    }
}

function _calculateNodeSize(node) {
    if (!node.__threeObj) {
        throw new Error("Node must have a 'mesh' property to calculate size.");
    }

    // Assuming `node.mesh` is a Three.js object to calculate size
    const boundingBox = new THREE.Box3().setFromObject(node.__threeObj); // Calculate the exact bounding box
    const size = new THREE.Vector3();
    boundingBox.getSize(size); // Extract the size (width, height, depth)

    return {
        width: size.x,
        height: size.y,
        depth: size.z,
    };
}