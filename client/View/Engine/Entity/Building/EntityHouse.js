const THREE = require('../../../../services/threejs');

class EntityHouse {

    constructor(model, tileSize, maxHeight) {
        this.model = model;
        this.element = EntityHouse.referenceMesh.clone();
        this.element.model = model;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.updateState(model, tileSize, maxHeight);
    }

    updateState(model, tileSize) {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = model.x * tileSize;
        matrixWorld[14] = model.z * tileSize;
        matrixWorld[13] = 0;
        matrixWorld[0] = Math.cos(model.a);
        matrixWorld[2] = Math.sin(model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }
}

require('./../async')(EntityHouse, 'obj/buildingA.obj');
EntityHouse.type = 'building';
module.exports = EntityHouse;
