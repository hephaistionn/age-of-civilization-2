const THREE = require('../../services/threejs');
const ENTITIES = require('./Entity/list');
const config = require('./config');

module.exports = class RoadPositioner {

    constructor(model) {
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.selected = null;
        this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        this.tileSize = config.tileSize;
        this.tileMaxHeight = config.tileMaxHeight;
    }

    updateState(model) {

    }

    update(dt) {

    }

    remove() {

    }
};
