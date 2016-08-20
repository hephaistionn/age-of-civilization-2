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
        let dx = Math.floor(x) - this.startX;
        let dz = Math.floor(z) - this.startZ;
        let nbX = Math.abs(dx);
        let nbZ = Math.abs(dz);

        let signX = dx / nbX;
        let signZ = dz / nbZ;
        const tiles = new Uint16Array((nbX + nbZ) * 2 + 2);

        if(nbX > nbZ) {
            for(let i = 0; i < nbX; i++) {
                tiles[i * 2] = this.startX + i * signX;
                tiles[i * 2 + 1] = this.startZ;
            }
            for(let i = 0; i < nbZ + 1; i++) {
                tiles[nbX * 2 + i * 2] = this.startX + dx;
                tiles[nbX * 2 + i * 2 + 1] = this.startZ + i * signZ;
            }
        } else {
            for(let i = 0; i < nbZ; i++) {
                tiles[i * 2] = this.startX;
                tiles[i * 2 + 1] = this.startZ + i * signZ;
            }
            for(let i = 0; i < nbX + 1; i++) {
                tiles[nbZ * 2 + i * 2] = this.startX + i * signX;
                tiles[nbZ * 2 + i * 2 + 1] = this.startZ + dz;
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
