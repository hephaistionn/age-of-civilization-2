const BUILDINGS = require('../Entity/list').buildings;

module.exports = Map=> {
    Map.prototype.initBuilding = function initBuilding(config) {
        this.buildings = {};
        for(let id in BUILDINGS) {
            this.buildings[id] = [];
        }
    };

    Map.prototype.newBuilding = function newBuilding(entity) {
        const type = entity.constructor.type;
        if(type !== 'building') return;
        const entityId = entity.constructor.name;
        this.buildings[entityId].push(new BUILDINGS[entityId](entity.x, entity.z, entity.a));
        this.lastEntityIdUpdated = entityId;
    };

    Map.prototype.removeBuilding = function removeBuilding(model) {
        const entityId = model.constructor.name;
        if(!this.buildings[entityId]) return;
        const index = this.buildings[entityId].indexOf(model);
        this.buildings[entityId].splice(index, 1);
        this.lastEntityIdUpdated = entityId;
    };

};