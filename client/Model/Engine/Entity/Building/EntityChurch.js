const Entity = require('../Entity.js');

class EntityChurch extends Entity {

    constructor(x, z, a) {
        super(x, z, a);
        this.space = 4;
    }

}

EntityChurch.tile_x = 1;
EntityChurch.tile_z = 2;
EntityChurch.type = 'building';
module.exports = EntityChurch;
