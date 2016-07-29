const THREE = require('../../../services/threejs');
const ENTITIES = require('../Entity/list');
const materialMap = require('./../materialMap');

module.exports = Map=> {

    Map.prototype.updateEntities = function updateEntities(model, id) {

        const entityId = model.lastEntityGroupUpdated||id;

        const groupView = this.entityGroups[entityId];
        const groupModel = model.entityGroups[entityId];

        let lengthModel = groupModel.length;
        for(let i = 0; i < lengthModel; i++) {

            let entityView = groupView[i];
            let entityModel = groupModel[i];

            if(!entityView) {
                let newEntityView = new ENTITIES[entityId](entityModel, this.tileSize, this.tileMaxHeight);
                groupView[i] = newEntityView;
                let chunkX = Math.floor(entityModel.x / this.tileByChunk);
                let chunkZ = Math.floor(entityModel.z / this.tileByChunk);
                this.chunks[chunkX][chunkZ].add(newEntityView.element);
            } else if(entityView.model !== entityModel) {
                groupView.splice(i, 1);
                entityView.element.parent.remove(entityView.element);
                i--;
            }
        }

        let lengthView = groupView.length;
        if(lengthView > lengthModel) {
            for(let i = lengthModel; i < lengthView; i++) {
                let entityView = groupView[i];
                entityView.element.parent.remove(entityView.element);
            }
            groupView.splice(lengthModel - 1, lengthView);
        }

    }

};
