const Entity = require('../Entity.js');

class EntityHouse extends Entity {

    constructor(params) {
        super(params);
        this.space = 4;
    }

}

EntityHouse.tile_x = 1;
EntityHouse.tile_z = 1;
EntityHouse.walkable = false;
module.exports = EntityHouse;
