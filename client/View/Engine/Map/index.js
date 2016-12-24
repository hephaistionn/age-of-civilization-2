const THREE = require('../../../services/threejs');
const ENTITIES = require('../Entity/listEntity');
const config = require('../config');

class Map {

    constructor(model) {

        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;

        this.tileByChunk = config.tileByChunk;
        this.tileSize = config.tileSize;
        this.tileHeight = config.tileHeight;
        this.nbPointX = model.nbPointX;
        this.nbPointZ = model.nbPointZ;
        this.pointsNormal = model.pointsNormal;

        this.entityDynamicList = [];
        this.entityGroups = {};
        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
        }

        this.initGround(model);
        //this.updateState(model);//called by update(dt) of screen
    }

    updateState(model) {

        while(model.entityGroupUpdated.length !== 0) {
            this.updateStateEntities(model.entityGroupUpdated.pop(), model);
        }

        while(model.updatedEntity.length !== 0) {
            this.updateStateOfOneEntities(model.updatedEntity.pop(), model.updatedEntity.pop());
        }

        this.updateVisibleTile(model);
    }

    update(dt) {
        this.updateDynamicEntities(dt);
        this.updateWater(dt);
    }

    remove() {

    }

    updateVisibleTile(model) {
        this.updateVisibleEntity(model);
        this.updateVisibleMap(model);
    }
}

require('./MapGround')(Map);
require('./MapEntities')(Map);

module.exports = Map;
