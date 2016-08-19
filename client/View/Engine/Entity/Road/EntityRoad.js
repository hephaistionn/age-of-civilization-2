const THREE = require('../../../../services/threejs');
const config = require('../../config');
const tileSize = config.tileSize;
const tileMaxHeight = config.tileMaxHeight;

class EntityRoad {

    constructor(model) {
        this.model = model;
        this.element = new THREE.Object3D();
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = true;
        console.log('constructor RoadView');
        this.updateState();
    }

    updateState() {
        //creation des attribute en fonction de la grid de la map
        console.log('updateState RoadView');
        this.model.map.grid;
    }

}
module.exports = EntityRoad;
