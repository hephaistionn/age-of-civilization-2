const stateManager = require('../../stateManager');
const pf = require('../../../services/pathfinding');
const finder = new pf.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
});

class Entity {

    constructor(params) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.a = 0;
        this.timer = 0;
        this.move(params.x || 0, params.y || 0, params.z || 0, params.a || 0);
    }

    move(x, y, z, a) {

        if(a !== undefined) {
            this.a = a;
        }

        let xNbTile = this.constructor.tile_x;
        let zNbTile = this.constructor.tile_z;

        if(this.a !== 0 && this.a !== Math.PI) {
            xNbTile = this.constructor.tile_z;
            zNbTile = this.constructor.tile_x;
        }

        const xFirstTile = Math.round((x - xNbTile / 2));
        const zFirstTile = Math.round((z - zNbTile / 2));

        this.x = xFirstTile + xNbTile / 2;
        this.z = zFirstTile + zNbTile / 2;
        this.y = y;

    }

    getTiles() {
        let xNbTile = this.constructor.tile_x;
        let zNbTile = this.constructor.tile_z;

        if(this.a !== 0 && this.a !== Math.PI) {
            xNbTile = this.constructor.tile_z;
            zNbTile = this.constructor.tile_x;
        }

        const xFirstTile = this.x - xNbTile / 2;
        const zFirstTile = this.z - zNbTile / 2;
        const xLastTile = xFirstTile + xNbTile;
        const zLastTile = zFirstTile + zNbTile;

        const tiles = [];
        for(let xi = xFirstTile; xi < xLastTile; xi++) {
            for(let zi = zFirstTile; zi < zLastTile; zi++) {
                tiles.push(xi);
                tiles.push(zi);
            }
        }
        return tiles;
    }

    updateTimer(dt) {
        this.timer += dt;
        if(this.timer > this.cycle) {
            this.update();
            this.timer = 0;
        }
    }

    computePath(params) {
        const map = params.map;
        const grid = map.grid;
        const tragetEntityId = params.tragetEntityId;
        let x = Math.floor(params.x);
        let z = Math.floor(params.z);
        const nearests = map.getNearestEntities(tragetEntityId, x, z);
        const sourceTiles = params.source.getTiles();
        let length = nearests.length;
        const paths = [];
        for(let i = 0; i < length; i++) {
            let entity = nearests[i];
            let targetTiles = entity.getTiles();
            let pathTarget = finder.findPathBetweenArea(sourceTiles, targetTiles, grid);
            if(pathTarget.length > 0)
                paths.push(pathTarget);
        }
        let path = paths[0];
        for(let k = 1; k < paths.length; k++) {
            if(path.length > paths[k].length) {
                path = paths[k];
            }
        }
        //compute height
        if(path) {
            length = path.length;
            for(let k = 0; k < length; k += 3) {
                x = path[k];
                z = path[k + 1];
                path[k + 2] = map.tilesHeight[map.nbTileX * z + x];
            }
            return path;
            //return pf.Util.compressPath(path);
        }
    }

    getPathLength() {
        let distance = 0;
        const l = this.path.length;
        for(let i = 0; i < l - 3; i += 3) {
            let dX1 = this.path[i + 3] - this.path[i];
            let dZ1 = this.path[i + 4] - this.path[i + 1];
            distance += Math.sqrt(dX1 * dX1 + dZ1 * dZ1);
        }
        return distance;
    }

}

Entity.construction = function construction() {
    const cost = this.cost;
    const resources = stateManager.resources;

    for(var resourceId in cost) {
        const valueRequired = cost[resourceId];
        const value = resources[resourceId];
        if(valueRequired > value) {
            return false;
        }
        resources[resourceId] -= valueRequired;
    }
    return true;
};

Entity.available = function available() {
    const require = this.require;

    for(var stateId in require) {
        const valueRequired = require[stateId];
        const value = stateManager[stateId];
        if(valueRequired > value) {
            return false;
        }
    }
    return true;
};

module.exports = Entity;