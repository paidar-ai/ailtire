import { create3D, view3D } from "./view3D.js";
import { create2D } from "./view2D.js";
import ElementForm from "./Form.svelte";
import { createTreeNode } from "./viewTreeNode";
import ElementDetail from "./Detail.svelte";

export const Element = {
    get3DView: view3D,
    get3DObject: create3D,
    get2DView: create2D,
    Form: ElementForm,
    getTreeNode: createTreeNode,
    Detail: ElementDetail
};
