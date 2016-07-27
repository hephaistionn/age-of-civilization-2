const pathFinding = require('../../services/pathFinding');
const ENTITIES = require('./Entity/list');

class Map {

    constructor(config) {

        this.tile_nx = config.tile_nx;
        this.tile_nz = config.tile_nz;
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

        this.initEntities(config.dataTrees, 'EntityTree');
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
        for(let i = 0; i < length; i += 3) {
            group.push(new ENTITIES[id](list[i], list[i + 2], list[i + 1], 0)); //x , z , y , a
        }
    }

;

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Map;
