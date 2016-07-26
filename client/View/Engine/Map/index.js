const THREE = require('../../../services/threejs');

class Map {

    constructor(model) {

        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;

        this.tileByChunk = 10;
        this.tileSize = model.tileSize;
        this.maxHeight = model.maxHeight;
        this.tileXcount = model.tile_nx;
        this.tileZcount = model.tile_nz;

        this.initGround(model);
        this.initResource(model);
        this.initBuilding(model);

    }

    updateState(model) {
        this.updateBuilding(model);
        this.updateResource(model);
    }

    update(dt) {

    }

    remove() {
    }

}

require('./MapGround')(Map);
require('./MapResource')(Map);
require('./MapBuilding')(Map);

module.exports = Map;
