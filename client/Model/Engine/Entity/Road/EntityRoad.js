class EntityRoad {

    constructor(params) {
        this.map = params.map;
        this.grid = this.map.grid;
    }

    updateState(params) {
        if(!params) return;
        const type = params.type;
        const tiles = params.tiles;
        const l = tiles.length;
        for(let i = 0; i < l; i += 2) {
            this.grid.setWalkableAt(tiles[i], tiles[i + 1], type);
        }
    }
}

EntityRoad.walkable = true;

module.exports = EntityRoad;
