const ENTITIES = require('./Entity/list');

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

        this.selected.moveTo(x, z, a);

        const tiles = this.selected.getTiles();

        this.undroppable = false;

        for(let i = 0; i < tiles.length; i += 2) {
            if(!map.grid.isWalkableAt(tiles[i], tiles[i + 1])) {
                this.undroppable = true;
                return;
            }
        }
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
