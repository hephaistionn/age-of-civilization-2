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
        const entity = new ENTITIES[entityId](entityRef.x, entityRef.z, entityRef.a);
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
            let entity = new ENTITIES[id](list[i], list[i + 2], list[i + 1], 0) //x , z , y , a
            group.push(entity); //x , z , y , a
            this.updateGrid(entity);
        }
    }

    updateGrid(entity, forceFree) {

        let walkable = entity.constructor.walkable;
        if(forceFree) walkable = walkable;
        let nx = entity.constructor.tile_x;
        let nz = entity.constructor.tile_z;
        let a = entity.a;
        let x = entity.x;
        let z = entity.z;

        if(a !== 0 && a !== Math.PI) {
            nx = entity.constructor.tile_z;
            nz = entity.constructor.tile_x;
        }

        let xFirstTile = Math.round((x - nx / 2));
        let zFirstTile = Math.round((z - nz / 2));

        for(let xi = xFirstTile; xi < xFirstTile + nx; xi++) {
            for(let zi = zFirstTile; zi < zFirstTile + nz; zi++) {
                this.grid.setWalkableAt(xi, zi, walkable);
            }
        }
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Map;
