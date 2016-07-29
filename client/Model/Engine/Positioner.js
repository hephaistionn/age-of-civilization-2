const ENTITIES = require('./Entity/list');

module.exports = class Positioner {

    constructor(config) {
        this.selected = null;
        this.tileSize = config.tileSize;
        this.tileHeight = config.tileHeight;
        this.tile_height = config.dataHeights;
        this.tile_nz = config.tile_nz;
        this.tile_nx = config.tile_nx;
        this.removeMode = false;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
    }

    placeSelectedEntity(x, z, a, map) {

        const y = this.getHeightTile(x, z);

        this.selected.moveTo(x, z, y, a);

        const tiles = this.selected.getTiles();

        this.undroppable = false;

        for(let i = 0; i < tiles.length; i += 2) {
            if(!map.grid.isWalkableAt(tiles[i], tiles[i + 1])) {
                this.undroppable = true;
                return;
            }
        }
    }

    getHeightTile(x, z) {
        const index1 = Math.floor(z) * this.tile_nz + Math.floor(x);
        const index2 = Math.floor(z) * this.tile_nz + Math.floor(x+1);
        const index3 = Math.floor(z+1) * this.tile_nz + Math.floor(x);
        const index4 = Math.floor(z+1) * this.tile_nz + Math.floor(x+1);

        const y1 = this.tile_height[index1];
        const y2 = this.tile_height[index2]||y1;
        const y3 = this.tile_height[index3]||y2;
        const y4 = this.tile_height[index4]||y3;

        return Math.min(y1,y2,y3,y4)/255;
    }

    getSelectedEntity() {
        if(this.selected && !this.undroppable) {
            return this.selected;
        }
    }

    selectEnity(id) {
        if(!this.selected || this.selected.constructor.name !== id) {
            this.selected = new ENTITIES[id](0, 0, 0, 0);
        } else {
            this.selected = null;
        }
        this.removeMode = false;
    }

    removeEnable() {
        this.removeMode = !this.removeMode;
        this.selected = null;
    }

    dismount() {
        this.selected = null;
    }
};
