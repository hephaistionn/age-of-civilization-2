const Entity = require('../Entity.js');
const ee = require('../../../../services/eventEmitter');

class EntityChurch extends Entity {

    constructor(params) {
        super(params);
        this.power = 0;
        this.timer = 0;
    }

    update() {
        this.power += 1;
        if(this.power === 5) {
            //ee.emit('newEntity', this.spowner());
        }
    }

    spowner() {
        return {}
    }

}

EntityChurch.cycle = 5000;
EntityChurch.tile_x = 2;
EntityChurch.tile_z = 1;
EntityChurch.walkable = false;
module.exports = EntityChurch;
