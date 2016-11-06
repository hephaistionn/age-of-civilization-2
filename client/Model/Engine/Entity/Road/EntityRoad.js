const stateManager = require('../../../../services/stateManager');

class EntityRoad {

    constructor(params) {
        this._map = params.map;
        this._grid = this._map.grid;
        this.tiles = null;
        this.walkable = null;
        this.length = 0;
        this.updateState(params);
    }

    updateState(params) {//on peut ajouter ou supprimer des tiles.
        if(!params) return;
        if(params.tiles instanceof Uint16Array){
            this.tiles = new Uint16Array(params.tiles);
            this.walkable = new Uint8Array(params.walkable);
        }else{
            this.tiles = new Uint16Array(params.tiles);
            this.walkable = new Uint8Array(params.walkable);
        }
        if(params.length)
            this.length = params.length * 2;
        const tiles = this.tiles;
        const walkable = this.walkable;
        const l = this.length * 2;
        for(let i = 0; i < l; i += 2) {
            this._grid.setWalkableAt(tiles[i], tiles[i + 1], walkable[i / 2]);
        }
    }
}

EntityRoad.construction = function construction(newRoad) {
    const roadType = newRoad.walkable[0];
    const cost = this.cost[roadType];
    const resources = stateManager.currentCity.resources;
    for(var resourceId in cost) {
        const valueRequired = cost[resourceId] * newRoad.length;
        const value = resources[resourceId];
        if(valueRequired > value) {
            return false;
        }
        resources[resourceId] -= valueRequired;
    }
    return true;
};

EntityRoad.available = function available(roadType) {
    const require = this.require[roadType];
    for(var stateId in require) {
        const valueRequired = require[stateId];
        const value = stateManager[stateId];
        if(valueRequired > value) {
            return false;
        }
    }
    return true;
};

EntityRoad.walkable = true;
EntityRoad.cost = [{}, {stone: 1}, {stone: 1}];
EntityRoad.require = [{},{population:4},{population:8}];
module.exports = EntityRoad;
