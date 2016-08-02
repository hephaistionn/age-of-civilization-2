const THREE = require('../../../services/threejs');
const ENTITIES = require('../Entity/list');
const config = require('../config');

class Map {

    constructor(model) {

        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;

        this.tileByChunk = config.tileByChunk;
        this.tileSize = config.tileSize;
        this.tileMaxHeight = config.tileMaxHeight;
        this.nbPointX = model.nbPointX;
        this.nbPointZ = model.nbPointZ;

        this.entityDynamicList = [];
        this.entityGroups = {};
        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
        }

        this.initGround(model);

        ENTITIES['EntityTree'].ready = () => {
            this.updateEntities(model, 'EntityTree');
        };
        if(!this.entityGroups['EntityTree'].length)
            ENTITIES['EntityTree'].ready();

    }

    updateState(model) {
        this.updateEntities(model);
    }


    update(dt) {
        let l = this.entityDynamicList.length;
        while(l--) {
            this.entityDynamicList[l].update(dt);
        }
    }

    remove() {

    }

}

require('./MapGround')(Map);
require('./MapEntities')(Map);

module.exports = Map;
