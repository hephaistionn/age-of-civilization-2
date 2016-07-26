const THREE = require('../../../services/threejs');

const Entities = require('../Entity/list').buildings;

module.exports = Map=> {

    Map.prototype.initBuilding = function initBuilding(model) {
        this.buildings = {};
        for(let id in Entities) {
            this.buildings[id] = [];
        }
    };


    Map.prototype.updateBuilding = function updateBuilding(model) {

        const entityId = model.lastEntityIdUpdated;

        const groupView = this.buildings[entityId];
        if(!groupView) return;
        const groupModel = model.buildings[entityId];

        let lengthModel = groupModel.length;

        for(let i = 0; i < lengthModel; i++) {

            let entityView = groupView[i];
            let entityModel = groupModel[i];

            if(!entityView) {
                let entityView = new Entities[entityId](entityModel, this.tileSize);
                groupView[i] = entityView;
                let chunkX = Math.floor(entityModel.x / this.tileByChunk);
                let chunkZ = Math.floor(entityModel.z / this.tileByChunk);
                this.chunks[chunkX][chunkZ].add(entityView.element);
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

    };

};
