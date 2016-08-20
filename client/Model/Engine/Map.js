const pathFinding = require('../../services/pathFinding');
const ENTITIES = require('./Entity/list');

class Map {

    constructor(config) {

        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.tiltMax = config.tiltMax || 50;
        this.pointsType = config.pointsType;
        this.pointsHeights = config.pointsHeights;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesType = config.tilesType;
        this.lastEntityGroupUpdated = [];
        this.lastEntityUpdated = null;
        this.grid = new pathFinding.Grid(this.nbTileX, this.nbTileZ, 1);
        this.entityGroups = {};
        this.entityDynamicList = [];

        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
        }

        this.initEntitiesResource(config.tilesResource, 'EntityTree');
        this.initGridByHeight(this.tilesTilt);
        this.initRoad();
    }

    newEntity(params) {

        const entityId = params.entityId;
        const entity = new ENTITIES[entityId](params);
        this.entityGroups[entityId].push(entity);
        if(this.lastEntityGroupUpdated.indexOf(entityId)===-1)
            this.lastEntityGroupUpdated.push(entityId);
        if(!entity.constructor.walkable) {
            this.setWalkableTile(entity, 0);
        }
        if(entity.update) {
            this.entityDynamicList.push(entity);
        }
    }

    removeEntity(entity) {
        const entityId = entity.constructor.name;
        let index = this.entityGroups[entityId].indexOf(entity);
        this.entityGroups[entityId].splice(index, 1);
        if(this.lastEntityGroupUpdated.indexOf(entityId)===-1)
            this.lastEntityGroupUpdated.push(entityId);
        if(!entity.constructor.walkable) {
            this.setWalkableTile(entity, 1);
        }
        if(entity.update) {
            index = this.entityDynamicList.indexOf(entity);
            this.entityDynamicList.splice(index, 1);
        }
    }

    updateEntity(entityId, model, params) {
        const entityGroup = this.entityGroups[entityId];
        this.lastEntityGroupUpdated.push(entityId);
        this.lastEntityUpdated = model ? entityGroup.indexOf(model) : 0;
        entityGroup[this.lastEntityUpdated].updateState(params);
    }

    initEntitiesResource(resources, id) {
        let length = resources.length;
        const params = {x: 0, y: 0, z: 0, a: 0, entityId: id};
        for(let i = 0; i < length; i++) {
            let value = resources[i];
            if(value === 0) continue;
            params.z = Math.floor(i / this.nbTileX);
            params.x = i % this.nbTileX;
            params.y = this.tilesHeight[i] / 255;
            params.a = Math.random() * Math.PI;
            this.newEntity(params);
        }
    }

    initRoad() {
        const params = {
            map: this,
            entityId: 'EntityRoad'
        };
        this.newEntity(params);
    }

    setWalkableTile(entity, walkable) {
        const tiles = entity.getTiles();
        for(let i = 0; i < tiles.length; i += 2) {
            this.grid.setWalkableAt(tiles[i], tiles[i + 1], walkable);
        }
    }

    clearTile(x, z, model) {
        if(model){
            this.removeEntity(model)
        }else{
            this.grid.setWalkableAt(Math.floor(x), Math.floor(z), 1);
            if(this.lastEntityGroupUpdated.indexOf('EntityRoad')===-1)
                this.lastEntityGroupUpdated.push('EntityRoad');//force redraw of roadview
            this.lastEntityUpdated = 0;
        }
    }

    getTile(tiles, x, z) {
        const index = z * this.nbTileX + x;
        return tiles[index];
    }


    getNearestEntities(EntityId, x, z, max) {
        max = max || 20;
        function filterNearest(entity) {
            return Math.abs(entity.x - x) < max && Math.abs(entity.z - z) < max;
        }

        function sortNearest(entityA, entityB) {
            let dA = Math.abs(entityA.x - x) + Math.abs(entityA.z - z);
            let dB = Math.abs(entityB.x - x) + Math.abs(entityB.z - z);
            return dA - dB;
        }

        const group = this.entityGroups[EntityId];
        const nearest = group.filter(filterNearest);
        nearest.sort(sortNearest);
        return nearest.splice(0, 3);
    }

    initGridByHeight() {
        let length = this.tilesTilt.length;
        for(let i = 0; i < length; i++) {
            let x = i % this.nbTileX;
            let z = Math.floor(i / this.nbTileX);
            let tilt = this.tilesTilt[i];
            let height = this.tilesHeight[i];
            if(tilt > this.tiltMax) {
                this.grid.setWalkableAt(x, z, 0);
            }else if(height < 45){
                this.grid.setWalkableAt(x, z, 0);
            }
        }
    }

    update(dt) {
        let l = this.entityDynamicList.length;
        while(l--) {
            this.entityDynamicList[l].updateTimer(dt);
        }
    }

    dismount() {

    }
}

module.exports = Map;
