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

EntityRoad.walkable = true;
EntityRoad.cost = [{}, {stone: 1}, {stone: 1}];

module.exports = EntityRoad;
