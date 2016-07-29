const pathFinding = require('../../services/pathFinding');
const ENTITIES = require('./Entity/list');

class Map {

    constructor(config) {

        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.tileSize = config.tileSize || 4;
        this.tileMaxHeight = config.tileMaxHeight || 10;
        this.tiltMax = config.tiltMax || 100;
        this.pointsType = config.pointsType;
        this.pointsHeights = config.pointsHeights;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesType = config.tilesType;
        this.lastEntityGroupUpdated = null;
        this.grid = new pathFinding.Grid(this.nbTileX, this.nbTileZ);
        this.entityGroups = {};

        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
        }

        this.initEntitiesResource(config.tilesResource, 'EntityTree');
        this.initGridByHeight(this.tilesTilt);
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

    initEntitiesResource(resources, id) {
        const group = this.entityGroups[id];
        let length = resources.length;
        for(let i = 0; i < length; i++) {
            let value = resources[i];

            if(value === 0){
                continue;
            }
            let z = Math.floor(i/this.nbTileX);
            let x = i%this.nbTileX;
            let y = this.tilesHeight[i]/255;

            let entity = new ENTITIES[id](x,z,y, 0); //x , z , y , a
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

    getTile(tiles, x, z) {
        const index = z * this.nbTileX + x;
        return tiles[index];
    }

    initGridByHeight(){
        let length = this.tilesTilt.length;
        for(let i=0; i<length; i++){
            let x = i%this.nbTileX;
            let z = Math.floor(i/this.nbTileX);
            let tilt = this.tilesTilt[i];
            if(tilt>this.tiltMax){
                this.grid.setWalkableAt(x, z, false);
            }
        }
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Map;
