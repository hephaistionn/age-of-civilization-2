const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileMaxHeight = config.tileMaxHeight;
const material = require('../materialB');
const THREE = require('three');

module.exports = class EntityPeon {

    constructor(model) {
        this.model = model;
        this.element = THREE.getMesh('obj/unityA/unityA.obj', material);
        this.element.userData.model = model;
        this.element.userData.parent = this;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        this.progress = 0;
        this.animProgress = 0;
        this.shape = new Shape(model.path || [], tileSize, tileMaxHeight);
        this.speed = model.speed * tileSize;
        this.updateState();
    }

    update(dt) {
        debugger;
        if(this.shape.length === 0) return;
        this.progress += dt * this.speed;
        this.animProgress += dt / 800;
        if(this.animProgress > 1) {
            this.animProgress = this.animProgress - 1;
        }

        this.progress = Math.min(this.shape.length, this.progress);
        let point = this.shape.getPointAndTangent(this.progress);

        if(!this.element.morphTargetInfluences) return;


        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = point[0];
        matrixWorld[13] = point[1];
        matrixWorld[14] = point[2];

        const a = Math.atan2(point[4], point[3]);

        matrixWorld[0] = Math.cos(a);
        matrixWorld[2] = Math.sin(a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];

        const tAnim = this.animProgress;

        this.element.morphTargetInfluences[0] = 0;
        this.element.morphTargetInfluences[1] = 0;
        this.element.morphTargetInfluences[2] = 0;
        this.element.morphTargetInfluences[3] = 0;

        if(tAnim >= 0 && tAnim < 0.25) {
            this.element.morphTargetInfluences[1] = tAnim / 0.25;
            this.element.morphTargetInfluences[0] = 1 - this.element.morphTargetInfluences[1];
        }
        if(tAnim >= 0.25 && tAnim < 0.5) {
            this.element.morphTargetInfluences[2] = tAnim / 0.25 - 1;
            this.element.morphTargetInfluences[1] = 1 - this.element.morphTargetInfluences[2];
        }
        if(tAnim >= 0.5 && tAnim < 0.75) {
            this.element.morphTargetInfluences[3] = tAnim / 0.25 - 2;
            this.element.morphTargetInfluences[2] = 1 - this.element.morphTargetInfluences[3];
        }
        if(tAnim >= 0.75 && tAnim < 1) {
            this.element.morphTargetInfluences[0] = tAnim / 0.25 - 3;
            this.element.morphTargetInfluences[3] = 1 - this.element.morphTargetInfluences[0];
        }
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
