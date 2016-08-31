const config = require('../../config');
const tileSize = config.tileSize;
const tileMaxHeight = config.tileMaxHeight;

class EntityChurch {

    constructor(model) {
        this.model = model;
        this.element = EntityChurch.referenceMesh.clone();
        this.element.model = model;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.updateState();
    }

    updateState() {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = this.model.x * tileSize;
        matrixWorld[14] = this.model.z * tileSize;
        matrixWorld[13] = this.model.y * tileMaxHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }
}

require('./../async').obj(EntityChurch, 'obj/buildingB.obj');
module.exports = EntityChurch;
