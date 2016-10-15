const THREE = require('../../../services/threejs');
const config = require('../config');

class Worldmap {

    constructor(model) {

        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;

        this.tileSize = config.tileSize;
        this.tileHeight = config.tileHeight;
        this.nbPointX = model.nbPointX;
        this.nbPointZ = model.nbPointZ;
        this.pointsNormal = model.pointsNormal;

        this.initGround(model);
    }

    updateState(model) {

    }

    update(dt) {
        this.updateWater(dt);
    }

    remove() {

    }
}

require('./WorldmapGround')(Worldmap);
require('./WorldmapCities')(Worldmap);

module.exports = Worldmap;
