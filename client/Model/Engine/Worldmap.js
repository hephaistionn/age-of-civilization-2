const pathfinding = require('../../services/pathfinding');
const City = require('./Entity/City');

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

    }

    addCity(params) {
        const city = new City(params);
        this.cities.push(city);
    }

    removeCity(city) {
        let index = this.cities.indexOf(city);
        this.cities.splice(index, 1);
    }

    updateCity(model) {
        let index = this.cities.indexOf(city);
        this.updatedCity.push(index);
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Worldmap;
