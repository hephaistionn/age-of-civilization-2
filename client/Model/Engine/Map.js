const pathfinding = require('../../services/pathfinding');
const ENTITIES = require('./Entity/listEntity');

class Map {

    constructor(config, cityModel) {

        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.tiltMax = config.tiltMax || 50;
        this.pointsType = config.pointsType;
        this.pointsHeights = config.pointsHeights;
        this.pointsNormal = config.pointsNormal;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesType = config.tilesType;
        this.entityGroupUpdated = [];
        this.updatedEntity = [];
        this.grid = new pathfinding.Grid(this.nbTileX, this.nbTileZ, 1);
        this.entityGroups = {};
        this.codeToEntities = {};
        this.isResource = {};
        this.entityDynamicList = [];

        for(let id in ENTITIES) {
            this.entityGroups[id] = [];
            if(ENTITIES[id].code) {
                this.codeToEntities[ENTITIES[id].code] = id;
                this.isResource[id] = true;
            }
        }

        this.initEntitiesCity(cityModel);
        this.initEntitiesResource(config.tilesResource);
        this.initGridByHeight(this.tilesTilt);
    }

    newEntity(params) {
        const entityId = params.entityId;
        params.map = this;//use by road;
        const entity = new ENTITIES[entityId](params);
        this.entityGroups[entityId].push(entity);
        if(this.entityGroupUpdated.indexOf(entityId) === -1)
            this.entityGroupUpdated.push(entityId);
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
        if(this.entityGroupUpdated.indexOf(entityId) === -1)
            this.entityGroupUpdated.push(entityId);
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
        const indexOfEntity = model ? entityGroup.indexOf(model) : 0;
        entityGroup[indexOfEntity].updateState(params);
        this.updatedEntity.push(indexOfEntity);
        this.updatedEntity.push(entityId);

    }

    setWalkableTile(entity, walkableStatus) {
        const tiles = entity.getTiles();
        if(this.entityGroups.EntityRoad.length){
            const walkable = new Uint8Array(tiles.length/2);
            for(let i = 0; i < walkable.length; i++) {
                walkable[i] = walkableStatus;
            }
            this.updateEntity('EntityRoad',null, {tiles:tiles,walkable:walkable,length:walkable.length});
        }else{
            for(let i = 0; i < tiles.length; i += 2) {
                this.grid.setWalkableAt(tiles[i], tiles[i + 1], walkableStatus);
            }
        }
    }

    clearTile(x, z, model) {
        if(model) {
            this.removeEntity(model)
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
            } else if(height < 45) {
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

    initEntitiesResource(resources) {
        let length = resources.length;
        const params = {x: 0, y: 0, z: 0, a: 0};
        for(let i = 0; i < length; i++) {
            let value = resources[i];
            if(value === 0) continue;
            params.entityId = this.codeToEntities[value];
            params.z = Math.floor(i / this.nbTileX);
            params.x = i % this.nbTileX;
            params.y = this.tilesHeight[i] / 255;
            params.a = Math.random() * Math.PI;
            if(this.grid.isWalkableAt(params.x, params.z)) {
                this.newEntity(params);
            }
        }
    }

    initEntitiesCity(cityModel) {
        for(let group in cityModel) {
            const list = cityModel[group];
            for(let i = 0; i < list.length; i++) {
                const params = list[i];
                params.map = this; //use by road;
                params.entityId = group;
                this.newEntity(params);
            }
        }
    }

    isWalkable(x, z) {
        if(x.length) {
            for(let i = 0; i < x.length; i += 2) {
                if(!this.grid.isWalkableAt(x[i], x[i + 1])) {
                    return false;
                }
            }
            return true;
        }else{
            return this.grid.isWalkableAt(x, z) ? true : false;
        }
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    syncState(model) {
        const hiddenProps = '_';
        for(let group in this.entityGroups) {
            model[group] = [];
            const list = this.entityGroups[group];
            for(let i = 0; i < list.length; i++) {
                const entity = list[i];
                const entityState = {};
                if(this.isResource[group] && !entity.exp) {
                    continue;
                }
                model[group][i] = entityState;
                for(let props in entity) {
                    if(props[0]===hiddenProps)continue;
                    if(entity[props] instanceof Uint16Array || entity[props] instanceof Uint8Array ){
                        entityState[props] = Array.from(entity[props])
                    }else{
                        entityState[props] = entity[props];
                    }
                }
            }
        }
    }
}

module.exports = Map;
