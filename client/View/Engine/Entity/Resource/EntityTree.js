const THREE = require('../../../../services/threejs');

class EntityTree {

    constructor(model, tileSize, maxHeight){
        this.element = EntityTree.referenceMesh.clone();
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.updateState(model, tileSize, maxHeight);
    }

    updateState(model, tileSize, maxHeight){

        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = model.x * tileSize;
        matrixWorld[14] = model.z * tileSize;
        matrixWorld[13] = model.y * maxHeight;
        matrixWorld[0] = Math.cos(model.a);
        matrixWorld[2] = Math.sin(model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }

};

require('./async')(EntityTree,'obj/treeA.obj');

module.exports = EntityTree;