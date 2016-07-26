const RESOURCES = require('../Entity/list').resources;

module.exports = Map=> {
    Map.prototype.initResource = function initResource(config) {

        this.resources = {};

        for(let id in RESOURCES) {
            this.resources[id] = [];
        }

        this.initTrees(config);
    };

    Map.prototype.initTrees = function initTrees(config) {
        const trees = config.dataForests;
        let nbTress = trees.length;
        const treesList = this.resources.EntityTree;
        for(let i = 0; i < nbTress; i++) {
            if(trees[i] !== 0) {
                //z * nbByWith+ x;
                let z = Math.floor(i / config.xSize);
                let x = i % config.xSize;
                let y = this.tile_height[z * config.xSize + x] / 255;
                let tree = new RESOURCES['EntityTree'](x, z, y, 0);
                treesList.push(tree);
            }
        }
    };

    Map.prototype.newResource = function newResource(entity) {
        const type = entity.constructor.type;
        if(type !== 'resource') return;
        const entityId = entity.constructor.name;
        this.resources[entityId].push(new RESOURCES[entityId](entity.x, entity.z, entity.a));
        this.lastEntityIdUpdated = entityId;
    };


    Map.prototype.removeResource = function removeResource(model) {
        const entityId = model.constructor.name;
        if(!this.resources[entityId]) return;
        const index = this.resources[entityId].indexOf(model);
        this.resources[entityId].splice(index, 1);
        this.lastEntityIdUpdated = entityId;
    };

};
