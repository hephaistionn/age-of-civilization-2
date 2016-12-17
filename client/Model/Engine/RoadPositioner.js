const EntityRoad = require('./Entity/Road/EntityRoad');

module.exports = class RoadPositioner {

    constructor(config) {
        this.selected = null;
        this.pointsHeights = config.pointsHeights;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.road = null;
        this.startX = 0;
        this.startZ = 0;
        this.maxTile = 30;
        this.updated = true;
        this.road = {
            tiles: new Uint16Array(2 * this.maxTile),
            walkable: new Uint8Array(this.maxTile),
            length: 0
        };
    }

    moveEntity(x, z, map) {
        x = Math.floor(x);
        z = Math.floor(z);
        this.road.tiles[0] = x;
        this.road.tiles[1] = z;
        this.road.walkable[0] = this.selected;
        if(!map.grid.isWalkableAt(x, z)) {
            this.road.walkable[0] = 0;
        }
        this.road.length = 1;
        this.updated = true;
    }

    rolloutSelectedEntity(x, z, map) {
        const tile1x = this.startX;
        const tile1z = this.startZ;
        const tile2x = Math.floor(x);
        const tile2z = Math.floor(z);
        const dx = tile2x - tile1x;
        const dz = tile2z - tile1z;
        const nbX = Math.abs(dx) + 1; //tile count
        const nbZ = Math.abs(dz) + 1; //tile count
        if(dx === 0 && dz === 0) return;
        const signX = dx / Math.abs(dx);
        const signZ = dz / Math.abs(dz);
        const tiles = this.road.tiles;
        const walkable = this.road.walkable;

        let ctn = 0;
        if(nbX >= nbZ) {
            for(let i = 0; i < nbX; i++) {
                tiles[ctn++] = this.startX + i * signX;
                tiles[ctn++] = this.startZ;
            }
            for(let i = 1; i < nbZ; i++) {
                tiles[ctn++] = this.startX + (nbX - 1) * signX;
                tiles[ctn++] = this.startZ + i * signZ;
            }
        } else {
            for(let i = 0; i < nbZ; i++) {
                tiles[ctn++] = this.startX;
                tiles[ctn++] = this.startZ + i * signZ;
            }
            for(let i = 1; i < nbX; i++) {
                tiles[ctn++] = this.startX + i * signX;
                tiles[ctn++] = this.startZ + (nbZ - 1) * signZ;
            }
        }

        const length = Math.min(ctn / 2, tiles.length);


        for(let i = 0; i < length; i++) {
            if(!map.grid.isWalkableAt(tiles[i * 2], tiles[i * 2 + 1])) {
                walkable[i] = 0;
            } else {
                walkable[i] = this.selected;
            }
        }
        this.road.length = length;
        this.updated = true;
    }

    mouseDown(x, z) {
        this.startX = Math.floor(x);
        this.startZ = Math.floor(z);
    }

    getNewRoad() {
        if(this.road.length) {
            const result = {
                tiles: this.road.tiles,
                walkable: this.road.walkable,
                length: this.road.length
            };
            this.road.length = 0;
            this.updated = true;
            return result;
        }
    }

    selectEnity(id) {
        if(!this.selected || this.selected !== id) {
            this.selected = id;
        } else {
            this.selected = null;
        }
        this.updated = true;
    }

    unselectEnity() {
        this.road.length = 0;
        this.selected = null;
        this.updated = true;
    }


    dismount() {
        this.selected = null;
    }
};
