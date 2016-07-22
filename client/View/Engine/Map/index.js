const THREE = require('../../../services/threejs');

class Map {

    constructor(model) {

        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;

        this.tileByChunk = 10;
        this.tileSize = 4;
        this.maxHeight = 10;
        this.tileXcount = model.tile_nx;
        this.tileZcount = model.tile_nz;

        this.initGround(model);
        this.initResource(model);

    }

    update(dt) {

    }

    remove() {
    }

}

require('./MapGround')(Map);
require('./MapResource')(Map);

module.exports = Map;
