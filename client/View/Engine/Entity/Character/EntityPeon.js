const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const THREE = require('three');

const animations = {
    walk: {
        duration: 800,
        steps: new Uint8Array([0,1,2,3,0])
    }
};

class EntityPeon {

    constructor(model) {
        this.model = model;
        this.element = THREE.getMesh('obj/unityA/unityA.obj', material);
        this.element.userData.model = model;
        this.element.userData.parent = this;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.absolute = true; //parent is word not chunk
        this.animations = animations;
        this.shape = new Shape(model.path || [], tileSize, tileHeight);
        this.moveSpeed = model.speed * tileSize;
        this.currentAnimation = 'walk';
        this.updateState();
    }

    update(dt) {
        this.followPath(dt);
        this.playAnimation( dt );
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

require('../decorator').followPath(EntityPeon);
require('../decorator').playAnimation(EntityPeon);

module.exports = EntityPeon;
