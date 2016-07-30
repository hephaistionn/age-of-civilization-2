const Entity = require('../Entity.js');

class EntityChurch extends Entity {

    constructor(x, z, y, a) {
        super(x, z, y, a);
        this.space = 4;
        this.timer = 0;
    }

    update() {

    }

}

EntityChurch.cycle = 5000;
EntityChurch.tile_x = 2;
EntityChurch.tile_z = 1;
EntityChurch.walkable = false;
module.exports = EntityChurch;
