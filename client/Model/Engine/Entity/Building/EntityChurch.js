const Entity = require('../Entity.js');
const ee = require('../../../../services/eventEmitter');
const stateManager = require('../../../stateManager');

class EntityChurch extends Entity {

    constructor(params) {
        super(params);
        this.power = 0;
        this.cycle = 2000;
        this.workers = 0;
        this.workplaces = 2;
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

    onConstruct() {
        this.workers = Math.min(stateManager.population - stateManager.workers, this.workplaces);
        stateManager.updateWorkers(this.workers);
    }
}

EntityChurch.selectable = true;
EntityChurch.description = 'This building increase the prosperity of your city';
EntityChurch.tile_x = 2;
EntityChurch.tile_z = 1;
EntityChurch.cost = {wood: 10, stone: 100};
EntityChurch.require = {population: 4};
EntityChurch.walkable = false;
module.exports = EntityChurch;
