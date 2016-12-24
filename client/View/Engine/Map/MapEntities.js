const ENTITIES = require('../Entity/listEntity');

module.exports = Map=> {

    Map.prototype.updateStateEntities = function updateStateEntities(entityId, model) {

        const groupView = this.entityGroups[entityId];
        const groupModel = model.entityGroups[entityId];

        let lengthModel = groupModel.length;
        for(let i = 0; i < lengthModel; i++) {

            let entityView = groupView[i];
            let entityModel = groupModel[i];

            if(!entityView) {
                let newEntityView = new ENTITIES[entityId](entityModel);
                groupView[i] = newEntityView;
                if(newEntityView.update) {
                    this.entityDynamicList.push(newEntityView);
                }
                newEntityView.element.visible = false; // all entities are hidden by default
                if(entityModel.x !== undefined && entityModel.z !== undefined && !newEntityView.absolute) {
                    let chunkX = Math.floor(entityModel.x / this.tileByChunk);
                    let chunkZ = Math.floor(entityModel.z / this.tileByChunk);
                    this.chunks[chunkX][chunkZ].add(newEntityView.element);
                } else {
                    this.element.add(newEntityView.element);
                }
            } else if(entityView.model !== entityModel) {
                groupView.splice(i, 1);
                entityView.element.parent.remove(entityView.element);
                if(entityView.update) {
                    let k = this.entityDynamicList.indexOf(entityView);
                    this.entityDynamicList.splice(k, 1);
                }
                i--;
            }
        }

        let lengthView = groupView.length;
        if(lengthView > lengthModel) {
            for(let i = lengthModel; i < lengthView; i++) {
                let entityView = groupView[i];
                entityView.element.parent.remove(entityView.element);
                if(entityView.update) {
                    let k = this.entityDynamicList.indexOf(entityView);
                    this.entityDynamicList.splice(k, 1);
                }
            }
            groupView.splice(lengthModel, lengthView);
        }
    };

    Map.prototype.updateStateOfOneEntities = function updateStateOfOneEntities(entityId, entityIndex) {
        const groupView = this.entityGroups[entityId];
        groupView[entityIndex].updateState();
    };

    Map.prototype.updateDynamicEntities = function updateDynamicEntities(dt) {
        const l = this.entityDynamicList.length;
        for(let i = 0; i < l; i++) {
            this.entityDynamicList[i].update(dt);
        }
    };

    Map.prototype.updateVisibleEntity = function updateVisibleEntity(model) {

        const flags = model.flags;
        const nbFlag = flags.length;

        for(let key in this.entityGroups) {
            const group = this.entityGroups[key];
            const groupModel = model.entityGroups[key];

            if(key === 'EntityRoad' && group && group.length) {
                group[0].updateVisible(model);
            }

            for(let i = 0; i < group.length; i++) {

                const element = group[i].element;
                const modelEntity = groupModel[i];

                for(let j = 0; j < nbFlag; j++) {
                    const fx = flags[j].x;
                    const fz = flags[j].z;

                    const dx = modelEntity.x - fx;
                    const dz = modelEntity.z - fz;

                    if(Math.sqrt(dx * dx + dz * dz) < 10) {
                        element.visible = true;
                        break;
                    }
                }

            }

        }
    };

};
