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

        this.cities = [];

        this.initGround(model);
    }

    updateState(model) {
        this.updateStateCities(model);

        while(model.updatedCity.length !== 0) {
            this.updateStateOfOneCities(model.updatedCity.pop());
        }
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
