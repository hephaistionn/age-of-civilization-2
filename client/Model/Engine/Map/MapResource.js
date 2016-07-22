const EntityTree = require('../Entity/Resource/EntityTree');

module.exports = Map=> {
    Map.prototype.initResource = function initResource(config) {

        this.resouces = {};

        this.initTrees(config);
    };

    Map.prototype.initTrees = function initTrees(config) {
        this.resouces.trees = [];
        const trees = config.dataForests;
        let nbTress = trees.length;
        const treesList = this.resouces.trees;
        for(let i = 0; i < nbTress; i++) {
            if(trees[i] !== 0) {
                //z * nbByWith+ x;
                let z = Math.floor(i / config.xSize);
                let x = i % config.xSize;
                let y = this.tile_height[z * config.xSize + x] / 255;
                let tree = new EntityTree(x, z, y, 0);
                treesList.push(tree);
            }
        }
    };

};