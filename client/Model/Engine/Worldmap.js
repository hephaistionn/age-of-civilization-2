const pathfinding = require('../../services/pathfinding');
const CITIES = require('./Entity/listCity');

class Worldmap {

    constructor(config) {

        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.pointsType = config.pointsType;
        this.pointsHeights = config.pointsHeights;
        this.pointsNormal = config.pointsNormal;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesType = config.tilesType;
        this.cityGroupUpdated = [];
        this.updatedCity = [];
        this.cityGroups = {};

        for(let id in CITIES) {
            this.cityGroups[id] = [];
        }

    }

    newEntity(params) {

    }

    removeEntity(entity) {

    }

    updateEntity(entityId, model, params) {

    }

    initRoad() {

    }

    setWalkableTile(entity, walkable) {

    }

    clearTile(x, z, model) {

    }


    getNearestEntities(EntityId, x, z, max) {

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

    }

    dismount() {

    }
}

module.exports = Worldmap;
