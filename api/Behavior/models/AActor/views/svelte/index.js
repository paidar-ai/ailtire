import { create3D, view3D } from "./view3D.js";
import { create2D } from "./view2D.js";
import ActorForm from "./Form.svelte";
import { createTreeNode } from "./viewTreeNode";
import ActorDetail from "./Detail.svelte";

export const Actor = {
    get3DView: view3D,
    get3DObject: create3D,
    get2DView: create2D,
    Form: ActorForm,
    getTreeNode: createTreeNode,
    Detail: ActorDetail,
};
