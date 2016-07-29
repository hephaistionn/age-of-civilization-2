const THREE = require('../../../../services/threejs');

class EntityTree {

    constructor(model, tileSize, tileHeight) {
        this.model = model;
        this.element = EntityTree.referenceMesh.clone();
        this.element.model = model;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.updateState(model, tileSize, tileHeight);
    }

    updateState(model, tileSize, tileHeight) {
        tileHeight = tileHeight||0;
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = model.x * tileSize;
        matrixWorld[14] = model.z * tileSize;
        matrixWorld[13] = model.y * tileHeight;
        matrixWorld[0] = Math.cos(model.a);
        matrixWorld[2] = Math.sin(model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }
}

require('./../async')(EntityTree, 'obj/treeA.obj');
module.exports = EntityTree;
