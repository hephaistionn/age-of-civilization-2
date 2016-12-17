const ENTITIES = require('./Entity/listEntity');

module.exports = class Positioner {

    constructor(config) {
        this.selected = null;
        this.tilesHeight = config.tilesHeight;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
        this.updated = false;
    }

    moveEntity(x, z, a, map) {
        this.x = x;
        this.z = z;
        const y = map.getHeightTile(x, z);
        this.selected.move(x, y, z, a);
        const tiles = this.selected.getTiles();
        this.undroppable = !map.isWalkable(tiles);
        this.updated = true;
    }

    selectEnity(id) {
        this.selected = new ENTITIES[id]({x: 0, y: 0, z: 0, a: 0});
        this.updated = true;
    }

    unselectEnity() {
        this.selected = null;
        this.updated = true;
    }

    dismount() {
        this.selected = null;
    }
};
