const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileMaxHeight = config.tileMaxHeight;

class EntityPeon {

    constructor(model) {
        this.model = model;
        this.element = EntityPeon.referenceMesh.clone();
        this.element.model = model;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.progress = 0;
        this.shape = new Shape(model.path||[], tileSize, tileMaxHeight);
        this.speed = model.speed * tileSize;
        this.updateState();
    }

    update(dt) {
        if(this.shape.length === 0) return;
        this.progress += dt * this.speed;
        this.progress = Math.min(this.shape.length, this.progress);
        let point = this.shape.getPointAndTangent(this.progress);
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = point[0];
        matrixWorld[13] = point[2];
        matrixWorld[14] = point[1];
        const a = Math.atan2(point[3], point[4]);
        matrixWorld[0] = Math.cos(a);
        matrixWorld[2] = Math.sin(a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
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

require('./../async')(EntityPeon, 'obj/resourceA.obj');
module.exports = EntityPeon;
