const Entity = require('../Entity.js');
const ee = require('../../../../services/eventEmitter');

class EntityChurch extends Entity {

    constructor(params) {
        super(params);
        this.power = 0;
        this.cycle = 2000;
    }

    update() {
        this.power += 1;
        if(this.power === 2) {
            ee.emit('newEntity', {
                entityId: 'EntityPeon',
                power: 5,
                x: this.x,
                y: this.y,
                z: this.z,
                a: 0,
                map: null,
                tragetEntityId: 'EntityHouse',
                source: this
            });
            this.power = 0;
        }
    }
}

EntityChurch.tile_x = 2;
EntityChurch.tile_z = 1;
EntityChurch.walkable = false;
module.exports = EntityChurch;
