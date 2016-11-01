
module.exports = class CityPositioner {

    constructor(config) {
        this.selected = null;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.buildable = false;
        this.tiltMax = 40;
        this.heightMin = 0.16;
        this.x = 0;
        this.z = 0;
        this.enabled = false;
    }

    moveCity(x, z) {
        this.x = x;
        this.z = z;
        this.y = this.getHeightTile(x, z);
        this.buildable = this.isBuildable(this.x, this.y, this.z);
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index]/255;
    }

    isBuildable(x, y, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        let tilt = this.tilesTilt[index];
        if(tilt > this.tiltMax) {
            return false;
        } else if( y < this.heightMin) {
            return false;
        }
        return true;
    }

    dismount() {
        this.selected = null;
    }
};
