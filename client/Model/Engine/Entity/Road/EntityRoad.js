const stateManager = require('../../../../services/stateManager');

class EntityRoad {

    constructor(params) {
        this.map = params.map;
        this.grid = this.map.grid;
    }

    updateState(params) {
        if(!params) return;
        const tiles = params.tiles;
        const walkable = params.walkable;
        const l = params.length * 2;
        for(let i = 0; i < l; i += 2) {
            this.grid.setWalkableAt(tiles[i], tiles[i + 1], walkable[i / 2]);
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
