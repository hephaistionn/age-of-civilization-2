module.exports = class RoadPositioner {

    constructor(config) {
        this.selected = null;
        this.tilesHeight = config.tilesHeight;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.undroppable = false;
        this.road = null;
        this.startX = 0;
        this.startZ = 0;
    }

    placeSelectedEntity(x, z, map) {
        x = Math.floor(x);
        z = Math.floor(z);
        const tiles = new Uint16Array(2);
        tiles[0] = x;
        tiles[1] = z;

        this.undroppable = false;

        if(!map.grid.isWalkableAt(tiles[0], tiles[1])) {
            this.undroppable = true;
            return;
        }

        this.road = {
            type: this.selected,
            tiles: tiles
        };

    }

    rolloutSelectedEntity(x, z, map) {
        const tile1x = this.startX;
        const tile1z = this.startZ;
        const tile2x = Math.floor(x);
        const tile2z = Math.floor(z);
        const dx = tile2x - tile1x;
        const dz = tile2z - tile1z;
        const nbX = Math.abs(dx)+1; //tile count
        const nbZ = Math.abs(dz)+1; //tile count
        if(dx===0 && dz===0) return;
        const signX = dx / Math.abs(dx);
        const signZ = dz / Math.abs(dz);
        const tiles = new Uint16Array((nbX + nbZ -1) * 2);

        let ctn = 0;
        if(nbX >= nbZ) {
            for(let i = 0; i < nbX; i++) {
                tiles[ctn++] = this.startX + i * signX;
                tiles[ctn++] = this.startZ;
            }
            for(let i = 1; i < nbZ; i++) {
                tiles[ctn++] = this.startX + (nbX-1) * signX;
                tiles[ctn++] = this.startZ + i * signZ;
            }
        } else {
            for(let i = 0; i < nbZ; i++) {
                tiles[ctn++] = this.startX;
                tiles[ctn++] = this.startZ + i * signZ;
            }
            for(let i = 0; i < nbX + 1; i++) {
                tiles[ctn++] = this.startX + i * signX;
                tiles[ctn++] = this.startZ + (nbZ-1) * signZ;
            }
        }

        this.undroppable = false;

        for(let i = 0; i < tiles.length; i += 2) {
            if(!map.grid.isWalkableAt(tiles[i], tiles[i + 1])) {
                this.undroppable = true;
                return;
            }
        }

        this.road = {
            type: 2,
            tiles: tiles
        };
    }

    mouseDown(x, z) {
        this.startX = Math.floor(x);
        this.startZ = Math.floor(z);
    }

    getNewRoad(){
        if(this.road){
            const road = this.road;
            this.road  = null;
            return road;
        }
    }

    selectEnity(id) {
        if(!this.selected || this.selected !== id) {
            this.selected = id;
        } else {
            this.selected = null;
        }
        this.removeMode = false;
    }


    dismount() {
        this.selected = null;
    }
};
