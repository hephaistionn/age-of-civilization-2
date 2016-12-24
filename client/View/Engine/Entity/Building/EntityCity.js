const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const THREE = require('three');
const material = require('../../Material/materialA');

module.exports = class EntityCity {

    constructor(model, materialForce) {
        this.model = model;
        let path = 'obj/cities/@1@2.obj';
        path = path.replace('@1', model.type).replace('@2', model.level);
        this.element = THREE.getMesh(path, materialForce || material);
        this.element.userData.model = model;
        this.element.userData.parent = this;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.element.name = 'EntityCity';
        this.updateState();
    }

    updateState() {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = this.model.x * tileSize;
        matrixWorld[14] = this.model.z * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }
};
