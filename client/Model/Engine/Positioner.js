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
        this.rotation = 0;
        this.x = 0;
        this.z = 0;
    }

    placeSelectedEntity(x, z, map) {
        this.x = x;
        this.z = z;
        const y = this._getHeightTile(x, z);
        this.selected.move(x, y, z, this.rotation);
        const tiles = this.selected.getTiles();
        this.undroppable = !map.isWalkable(tiles);

    }

    _getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    selectEnity(id) {
        this.rotation = 0;
        this.selected = new ENTITIES[id]({x: 0, y: 0, z: 0, a: this.rotation});
    }

    unselectEnity() {
        this.selected = null;
        this.rotation = 0;
    }

    increaseRotation(map) {
        this.rotation += this.rotation >= Math.PI * 2 ? -this.rotation : Math.PI / 2;
        const y = this._getHeightTile(this.x, this.z);
        this.selected.move(this.x, y, this.z, this.rotation);
        const tiles = this.selected.getTiles();
        this.undroppable = !map.isWalkable(tiles);
    }

    dismount() {
        this.selected = null;
    }
};
