module.exports = class RoadPositioner {

    constructor(config) {
        this.selected = null;
        this.tilesHeight = config.tilesHeight;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.removeMode = false;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
        this.road = {
            type: 0,
            tiles: []
        };
    }

    placeSelectedEntity(x, z, map) {

    }

    rolloutSelectedEntity(x, z, map) {

    }

    mouseDown(x, z) {

    }

    selectEnity(id) {
        if(!this.selected || this.selected !== id) {
            this.selected = id;
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
