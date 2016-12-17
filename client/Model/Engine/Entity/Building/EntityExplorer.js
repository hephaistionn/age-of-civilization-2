const Entity = require('../Entity.js');
const stateManager = require('../../../../services/stateManager');

class EntityExplorer extends Entity {

    constructor(params) {
        super(params);
        this.explorers = params.explorers || 1;
    }

    onConstruct() {
        stateManager.updateExplorers(this.explorers);
    }

    onAction() {
        const states = stateManager.getCurrentCity().states;
        if(states.explorers >= this.explorers){
            return 'EntityFlag';
        }
    }

}

EntityExplorer.selectable = true;
EntityExplorer.description = 'This building trains explorers';
EntityExplorer.actionLabel = 'explore';
EntityExplorer.tile_x = 1;
EntityExplorer.tile_z = 1;
EntityExplorer.walkable = false;
EntityExplorer.cost = {wood: 20};
EntityExplorer.require = {};
module.exports = EntityExplorer;
