const pathFinding = require('../../services/pathFinding');
const ENTITIES = require('./Entity/list');

class Map {

    constructor(config) {

        this.tile_nx = config.xSize;
        this.tile_nz = config.ySize;
        this.tileSize = config.tileSize || 4;
        this.maxHeight = config.maxHeight || 10;
        this.tile_type = config.dataSurfaces;
        this.tile_height = config.dataHeights;
        this.lastEntityGroupUpdated = null;
        this.grid = new pathFinding.Grid(this.tile_nx, this.tile_nz);
        this.entityGroups = {};

        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
        }

        this.initEntities(config.dataForests, 'EntityTree' );
    }

    newEntity(entityRef) {
        const entityId = entityRef.constructor.name;
        this.entityGroups[entityId].push(new ENTITIES[entityId](entityRef.x, entityRef.z, entityRef.a));
        this.lastEntityGroupUpdated = entityId;
    }

    removeEntity(entity) {
        const entityId = entity.constructor.name;
        const index = this.entityGroups[entityId].indexOf(entity);
        this.entityGroups[entityId].splice(index, 1);
        this.lastEntityGroupUpdated = entityId;
    }

    initEntities(list, id) {
        const group = this.entityGroups[id];
        let length = list.length;
        for(let i = 0; i < length; i++) {
            if(list[i] !== 0) {
                let z = Math.floor(i / this.tile_nx);
                let x = i % this.tile_nx;
                let y = this.tile_height[z * this.tile_nx + x] / 255;
                let entity = new ENTITIES[id](x, z, y, 0);
                group.push(entity);
            }
        }
    };

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Map;
