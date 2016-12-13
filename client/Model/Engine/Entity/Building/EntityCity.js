const stateManager = require('../../../../services/stateManager');

class EntityCity {

    constructor(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.a = params.a || 0;
        this.level = params.level || 1;
        this.type = params.type || 'mesopotamia';
        this.name = params.name || 'no name';
        this.leader = params.leader || 'free';
        this.id = params.id;
    }

    move(x, y, z, a) {
        this.a = a;
        this.x = x;
        this.z = z;
        this.y = y;
    }

    getTiles() {
        const xFirstTile = this.x - 1 / 2;
        const zFirstTile = this.z - 1 / 2;
        const xLastTile = xFirstTile + 1;
        const zLastTile = zFirstTile + 1;
        const tiles = [];
        for(let xi = xFirstTile; xi < xLastTile; xi++) {
            for(let zi = zFirstTile; zi < zLastTile; zi++) {
                tiles.push(xi);
                tiles.push(zi);
            }
        }
        return tiles;
    }
}

EntityCity.selectable = true;
EntityCity.description = 'This is a City';

module.exports = EntityCity;