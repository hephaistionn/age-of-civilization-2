const BUILDINGS = require('./Entity/list').buildings;
const RESOURCES = require('./Entity/list').resources;

module.exports = class Positioner {

    constructor(config) {
        this.selected = null;
        this.tileSize = config.tileSize;
        this.removeMode = false;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
    }

    placeSelectedEntity(x, z, a, map) {

        x = x / this.tileSize;
        z = z / this.tileSize;

        const entityClass = this.selected.constructor;

        ///number of tile
        let sizeX = entityClass.tile_x;
        let sizeZ = entityClass.tile_z;

        if(a !== 0 && a !== Math.PI) {
            sizeX = entityClass.tile_z;
            sizeZ = entityClass.tile_x;
        }

        //get first tiles
        const xFirstTile = Math.round((x - sizeX / 2));
        const zFirstTile = Math.round((z - sizeZ / 2));

        //get center of entity
        this.selected.x = xFirstTile + sizeX / 2;
        this.selected.z = zFirstTile + sizeZ / 2;
        this.selected.a = a;
        //the reference model is placed on the screen

        //check if space is available
        this.undroppable = false;

        for(let xi = xFirstTile; xi < xFirstTile + sizeX; xi++) {
            for(let zi = zFirstTile; zi < zFirstTile + sizeZ; zi++) {
                if(!map.grid.isWalkableAt(xi, zi)) {
                    this.undroppable = true;
                    return;
                }
            }
        }
    }

    selectEnity(id) {
        if(!this.selected || this.selected.constructor.name !== id) {
            if(BUILDINGS[id]) {
                this.selected = new BUILDINGS[id](0, 0, 0);
            } else if(RESOURCES[id]) {
                this.selected = new RESOURCES[id](0, 0, 0);
            }
        } else {
            this.selected = null;
        }
        this.removeMode = false;
    }

    setCurrentPosition(x, z) {
        this.x = x / this.tileSize;
        this.z = z / this.tileSize;
    }

    removeEnable() {
        this.removeMode = !this.removeMode;
        this.selected = null;
    }


    dismount() {
        this.selected = null;
    }
};
