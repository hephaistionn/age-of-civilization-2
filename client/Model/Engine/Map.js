const pathFinding = require('../../services/pathFinding');
const ENTITIES = require('./Entity/list');

class Map {

    constructor(config) {

        this.tile_nx = config.tile_nx;
        this.tile_nz = config.tile_nz;
        this.tileSize = config.tileSize || 4;
        this.tileHeight = config.tileHeight || 10;
        this.tile_type = config.dataSurfaces;
        this.tile_height = config.dataHeights;
        this.lastEntityGroupUpdated = null;
        this.grid = new pathFinding.Grid(this.tile_nx, this.tile_nz);
        this.entityGroups = {};

        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
        }

        this.initEntities(config.dataTrees, 'EntityTree');
        this.initGridByHeight();
    }

    newEntity(entityRef) {
        const entityId = entityRef.constructor.name;
        const entity = new ENTITIES[entityId](entityRef.x, entityRef.z, entityRef.y, entityRef.a);
        this.entityGroups[entityId].push(entity);
        this.lastEntityGroupUpdated = entityId;
        this.updateGrid(entity);
    }

    removeEntity(entity) {
        const entityId = entity.constructor.name;
        const index = this.entityGroups[entityId].indexOf(entity);
        this.entityGroups[entityId].splice(index, 1);
        this.lastEntityGroupUpdated = entityId;
        this.updateGrid(entity, true);
    }

    initEntities(list, id) {
        const group = this.entityGroups[id];
        let length = list.length;
        for(let i = 0; i < length; i += 3) {
            let entity = new ENTITIES[id](list[i], list[i + 2], list[i + 1], 0); //x , z , y , a
            group.push(entity);
            this.updateGrid(entity);
        }
    }

    updateGrid(entity, forceFree) {

        let walkable = entity.constructor.walkable;
        if(forceFree) walkable = walkable;

        const tiles = entity.getTiles();

        for(let i = 0; i < tiles.length; i += 2) {
            this.grid.setWalkableAt(tiles[i], tiles[i + 1], walkable);
        }
    }

    initGridByHeight(){
       // this.tile_height
       // this.grid
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Map;
