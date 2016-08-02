const pf = require('../../../services/pathfinding');
const finder = new pf.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
});

module.exports = class Entity {

    constructor(params) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.a = 0;
        this.timer = 0;
        this.move(params.x, params.y, params.z, params.a);
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
        const x = Math.floor(params.x);
        const z = Math.floor(params.z);
        const nearests = map.getNearestEntities(tragetEntityId, x, z);
        const sourceTiles = params.source.getTiles();
        const length = nearests.length;
        const paths = [];
        for(let i = 0; i < length; i++) {
            let entity = nearests[i];
            let targetTiles = entity.getTiles();
            let pathTarget = finder.findPathBetweenArea(sourceTiles, targetTiles, grid.clone());
            paths.push(pathTarget);
        }
        let path = paths[0];
        for(let k = 1; k < paths.length; k++) {
            if(path.length > paths[k].length) {
                path = paths[k];
            }
        }
        if(path) {
            return pf.Util.compressPath(path);
        }
    }

    getPathLength() {
        let distance = 0;
        const l = this.path.length;
        for(let i = 0; i < l - 1; i++) {
            let dX1 = this.path[i + 1][0] - this.path[i][0];
            let dZ1 = this.path[i + 1][1] - this.path[i][1];
            distance += Math.sqrt(dX1 * dX1 + dZ1 * dZ1);
        }
        return distance;
    }

};