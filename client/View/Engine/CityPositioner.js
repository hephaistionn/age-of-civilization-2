const THREE = require('../../services/threejs');
const ENTITIES = require('./Entity/listEntity');
const config = require('./config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;


module.exports = class CityPositioner {

    constructor(model) {
        this.model = model;
        this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        this.element = THREE.getMesh('obj/buildingA.obj', this.material);
        this.element.userData.parent = this;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;

        this.updateState();
    }

    updateState() {
        if(this.model.enabled){
            this.element.visible = true;
            const matrixWorld = this.element.matrixWorld.elements;
            matrixWorld[12] = this.model.x * tileSize;
            matrixWorld[13] = this.model.y * tileHeight;
            matrixWorld[14] = this.model.z * tileSize;
            this.material.color.setHex(this.model.buildable ?  0x0000ff : 0xff0000);
        }else{
            this.element.visible = false;
        }
    }

    update(dt) {

    }

    remove() {

    }
};
