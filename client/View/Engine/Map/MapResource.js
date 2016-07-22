const THREE = require('../../../services/threejs');

const EntityTree = require('../Entity/Resource/EntityTree');

module.exports = Map=> {

    Map.prototype.initResource = function initResource(model) {
        let i = 0, l = 0;

        this.resources = {};
        EntityTree.ready = () => {
            let modelTrees = model.resouces.trees;
            l = modelTrees.length;
            this.resources.trees = [];
            for(i = 0; i < l; i++) {
                let modelTree = modelTrees[i];
                let tree = new EntityTree(modelTree, this.tileSize, this.maxHeight);
                this.resources.trees.push(tree);
                let chunkX = Math.floor(modelTree.x / this.tileByChunk);
                let chunkZ = Math.floor(modelTree.z / this.tileByChunk);
                this.chunks[chunkX][chunkZ].add(tree.element);
            }
            window.chunk = this.chunks
        };
        if(!this.resources.trees)
            EntityTree.ready();


    };

};