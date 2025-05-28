import { create3D, view3D } from "./view3D.js";
import { create2D } from "./view2D.js";
import Form from "./Form.svelte";
import { createTreeNode } from "./viewTreeNode";
import Detail from "./Detail.svelte";

export const UseCase = {
    get3DView: view3D,
    get3DObject: create3D,
    get2DView: create2D,
    Form: Form,
    getTreeNode: createTreeNode,
    Detail: Detail
};
