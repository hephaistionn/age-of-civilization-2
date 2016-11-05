const Entity = require('../Entity.js');

class EntityTree extends Entity {

    constructor(params) {
        super(params);
        this.wood = 100;
    }

}
EntityTree.selectable = false;
EntityTree.tile_x = 1;
EntityTree.tile_z = 1;
EntityTree.walkable = false;
EntityTree.code = 50; //value in alpha blue
module.exports = EntityTree;
