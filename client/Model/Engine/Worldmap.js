const pathfinding = require('../../services/pathfinding');
const EntityCity = require('./Entity/Building/EntityCity');

class Worldmap {

    constructor(config) {

        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.pointsType = config.pointsType;
        this.pointsHeights = config.pointsHeights;
        this.pointsNormal = config.pointsNormal;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesType = config.tilesType;
        this.cities = [];
        this.updatedCity = [];
        this.tiltMax = 40;
        this.heightMin = 0.16;
        this.updated = true;
    }

    addCity(params) {
        const city = new EntityCity(params);
        this.cities.push(city);
        this.updated = true;
    }

    removeCity(city) {
        let index = this.cities.indexOf(city);
        this.cities.splice(index, 1);
        this.updated = true;
    }

    updateCity(model) {
        let index = this.cities.indexOf(city);
        this.updatedCity.push(index);
        this.updated = true;
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    isWalkable(x, z) {
        if(x.length) {
            for(let i = 0; i < x.length; i += 2) {
                const index = Math.floor(x[i + 1]) * this.nbTileX + Math.floor(x[i]);
                const tilt = this.tilesTilt[index];
                const y = this.tilesHeight[index] / 255;
                if(tilt > this.tiltMax) {
                    return false;
                } else if(y < this.heightMin) {
                    return false;
                }
            }
        } else {
            const index = Math.floor(z) * this.nbTileX + Math.floor(x);
            const tilt = this.tilesTilt[index];
            const y = this.tilesHeight[index] / 255;
            if(tilt > this.tiltMax) {
                return false;
            } else if(y < this.heightMin) {
                return false;
            }
        }
        return true;
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Worldmap;
