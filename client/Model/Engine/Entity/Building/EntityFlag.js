const Entity = require('../Entity.js');
const stateManager = require('../../../../services/stateManager');

class EntityFlag extends Entity {

    constructor(params) {
        super(params);
    }

    onConstruct() {
        //stateManager.updateExplorers(-1);
    }

}

EntityFlag.selectable = false;
EntityFlag.flag = true;
EntityFlag.tile_x = 1;
EntityFlag.tile_z = 1;
EntityFlag.walkable = true;
EntityFlag.cost = {explorers: 0};
EntityFlag.require = {};
module.exports = EntityFlag;
