const THREE = require('../../../services/threejs');
const ENTITIES = require('../Entity/list');

class Map {

    constructor(model) {

        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;

        this.tileByChunk = 10;
        this.tileSize = model.tileSize;
        this.tileHeight = model.tileHeight;

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

    }

    remove() {

    }

}

require('./MapGround')(Map);
require('./MapEntities')(Map);

module.exports = Map;
