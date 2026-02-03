import { Mesh, MeshBasicMaterial} from 'three';
import * as THREE from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

let loadedFont = null;

export default class AText {
    static view3D(node, type) {
        try {
            // Get the preloaded font
            const font = getFontSync();

            // Default text and parameters
            const text = node.text || 'Default Text'; // Multiline input
            const color = node.color || 0xffffff;
            const scolor = 0xff0000;
            const size = node.size || 1; // Font size
            const depth = node.depth || 1; // Text depth/thickness
            const lineHeight = node.lineHeight || 1.2; // Space between lines
            const horizontalAlign = node.horizontalAlign || 'center'; // Horizontal alignment
            const verticalAlign = node.verticalAlign || 'middle'; // Vertical alignment
            const depthAlign = node.depthAlign || 'front'; // Depth alignment

            // Split text into lines
            const lines = text.split('\n');

            // Create a group to store all lines
            const textGroup = new THREE.Group();
            // Loop through each line and create TextGeometry
            lines.forEach((line, index) => {
                const geometry = new TextGeometry(line, {
                    font: font,
                    size: size,
                    depth: depth,
                    curveSegments: 12, // Smooth letters
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 5,
                });

                // Compute the bounding box of the line's geometry
                geometry.computeBoundingBox();
                const bbox = geometry.boundingBox;
                const lineWidth = bbox.max.x - bbox.min.x; // Geometry width for this line

                // Determine the horizontal alignment offset
                let offsetX = 0;
                if (horizontalAlign === 'center') {
                    offsetX = -lineWidth / 2;
                } else if (horizontalAlign === 'right') {
                    offsetX = -lineWidth;
                } // Left-align is default (offsetX = 0)

                // Calculate vertical position of this line
                const lineOffsetY = -index * size * lineHeight; // Position lines vertically

                // Apply the offsets to the geometry
                geometry.translate(offsetX, lineOffsetY, 0); // Create material and mesh for the line
                const material = new MeshBasicMaterial({ color });
                const lineMesh = new Mesh(geometry, material);

                // Add the line mesh to the group
                textGroup.add(lineMesh);
            });
            recenterTextGroup(textGroup);

            let bb = new THREE.Box3().setFromObject(textGroup);
            const totalTextWidth = bb.max.x - bb.min.x;
            const totalTextHeight = bb.max.y - bb.min.y;

            const parentGeometry = node.parent || null; // Get the parent (if any)
            if (parentGeometry) {
                parentGeometry.add(textGroup);
                const parentBB = new THREE.Box3().setFromObject(parentGeometry);
                const parentWidth = parentBB.max.x - parentBB.min.x;
                const parentHeight = parentBB.max.y - parentBB.min.y;
                const parentDepth = parentBB.max.z - parentBB.min.z;
                // Horizontal alignment of the text group within the parent
                if (horizontalAlign === 'center') {
                    textGroup.position.x = 0
                } else if (horizontalAlign === 'right') {
                    textGroup.translateX(parentWidth/2 - totalTextWidth/2);
                } else {
                    textGroup.translateX(-(parentWidth/2 - totalTextWidth/2));
                }

                // Vertical alignment of the text group within the parent
                if (verticalAlign === 'middle') {
                    textGroup.position.y = 0;
                } else if (verticalAlign === 'top') {
                    textGroup.translateY((parentHeight/2 - totalTextHeight));
                } else {
                    textGroup.translateY(-(parentHeight/2 -totalTextHeight));
                }
                if(depthAlign === 'center') {
                    textGroup.position.z = 0;
                } else if(depthAlign === 'front') {
                    textGroup.translateZ(parentDepth/2);
                } else if(depthAlign === 'back') {
                    textGroup.translateZ(-parentDepth/2)
                }
            } else {
                // If there is no parent, align relative to local origin (e.g., 0, 0)
                if (horizontalAlign === 'center') {
                    textGroup.position.x = 0;
                } else if (horizontalAlign === 'right') {
                    textGroup.position.x = totalTextWidth/2;
                } else {
                    textGroup.position.x = -totalTextWidth/2; // Left-aligned
                }

                if (verticalAlign === 'middle') {
                    textGroup.position.y = 0;
                } else if (verticalAlign === 'top') {
                    textGroup.position.y = totalTextHeight/2; // Top of block is aligned with origin
                } else {
                    textGroup.position.y = -totalTextHeight/2; // Bottom-aligned
                }
            }
            // Apply any additional user-defined offsets
            // textGroup.position.x += node.x || 0;
            // textGroup.position.y += node.y || 0;
            // textGroup.position.z += node.z || 0;

            // Apply rotation if specified
            /*
            if (node.rotation) {
                textGroup.rotation.set(
                    node.rotation.x || 0,
                    node.rotation.y || 0,
                    node.rotation.z || 0
                );
            }

             */

            return textGroup; // Return the group
        } catch (err) {
            console.error(`Failed to create text with alignment: ${err.message}`);
            console.error(err);
            return null; // Return null in case of an error
        }
    }
}

function preloadFontSync(path = '/fonts/helvetiker_regular.typeface.json') {
    if (loadedFont) {
        return loadedFont; // If already loaded, return it
    }

    const loader = new FontLoader();

    const request = new XMLHttpRequest(); // Use XMLHttpRequest for synchronous fetching
    request.open('GET', path, false); // `false` makes the request synchronous
    request.send();

    if (request.status === 200) {
        const fontData = JSON.parse(request.responseText);
        loadedFont = loader.parse(fontData); // Parse the font data into a usable font object
        return loadedFont;
    } else {
        console.error(`Error preloading font: ${request.status}`);
        throw new Error(`Failed to preload font from ${path}`);
    }
}

export function getFontSync(path = '/fonts/helvetiker_regular.typeface.json') {
    if (!loadedFont) {
        preloadFontSync();
    }
    return loadedFont;
}
function recenterTextGroup(textGroup) {
    // Step 1: Compute the bounding box of the group
    const bbox = new THREE.Box3().setFromObject(textGroup);
    const groupHeight = bbox.max.y - bbox.min.y; // Total height of the group
    const groupWidth = bbox.max.x - bbox.min.x; // Total width of the group

    // Step 2: Find the center offset
    const centerX = bbox.min.x + groupWidth / 2;
    const centerY = bbox.min.y + groupHeight / 2;

    // Step 3: Reposition the group to center it at (0, 0, 0)
    textGroup.children.forEach((child) => {
        // Adjust each child's position relative to (0, 0)
        child.position.x -= centerX;
        child.position.y -= centerY;
    });

    // Optional: You can also directly adjust the whole group to bring it back to (0, 0) externally
    textGroup.position.x = 0;
    textGroup.position.y = 0;
}

