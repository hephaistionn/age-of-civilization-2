const Entity = require('../Entity.js');
const ee = require('../../../../services/eventEmitter');

class EntityPeon extends Entity {

    constructor(params) {
        super(params);
        this.power = params.power || 0;
        this.speed = 0.001;
        this.path = this.computePath(params);
        this.cycle = 0;
        if(this.path) {
            this.cycle = this.getPathLength() / this.speed;
        }
    }

    update() {
        ee.emit('removeEntity', this);
        if(this.path) {
            //ee.emit transmettre les donnée au target
        } else {
            //emit => rendre les donnee à la source
        }
    }

}

EntityPeon.selectable = true;
EntityPeon.description = 'I will go to an home to transmit my knowledge';
EntityPeon.tile_x = 1;
EntityPeon.tile_z = 1;
EntityPeon.walkable = true;
module.exports = EntityPeon;
