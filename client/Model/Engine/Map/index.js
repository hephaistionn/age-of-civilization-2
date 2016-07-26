var pathFinding = require('../../../services/pathFinding');

class Map {

    constructor(config) {

        this.tile_nx = config.xSize;
        this.tile_nz = config.ySize;
        this.tileSize = config.tileSize || 4;
        this.maxHeight = config.maxHeight || 10;
        this.lastEntityIdUpdated = null;

        this.grid = new pathFinding.Grid(this.tile_nx, this.tile_nz);

        this.initSurface(config);
        this.initResource(config);
        this.initBuilding(config);
        this.initCharacter(config);
    }

    newEntity(model) {
        this.newResource(model);
        this.newBuilding(model);
    }

    removeEntity(model) {
        this.removeResource(model);
        this.removeBuilding(model);
    }

    update(dt) {

    }

    dismount() {

    }
}

require('./MapResource')(Map);
require('./MapSurface')(Map);
require('./MapBuilding')(Map);
require('./MapCharacter')(Map);

module.exports = Map;
