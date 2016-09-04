const ee = require('../../services/eventEmitter');
const stateManager = require('../stateManager');


module.exports = class BuildingMenu {

    constructor(config) {
        this.categories = {
            resource: [{id: 'Destroy'}],
            factory: [{id: 'Destroy'}],
            service: [{id: 'Destroy'}],
            culture: [{id: 'EntityChurch', required: {}}, {id: 'Destroy'}],
            state: [{id: 'EntityHouse', required: {}}, {id: 'EntityHouse', required: {}},
                {id: 'EntityHouse', required: {}}, {id: 'EntityHouse', required: {}},
                {id: 'Road', required: {}}, {id: 'Destroy'}]
        };
        this.currentCategory = [];
        this.currentFocus = null;
        this.displayed = false;

        this.labelButtonOpen = 'Build';
        this.labelButtonClose = 'Close';

        this.type = 'UI';

    }

    open() {
        this.displayed = true;
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    close() {
        this.displayed = false;
        this.currentCategory = [];
        if(this._close)this._close();
        ee.emit('onUpdate', 'buildingMenu', this);
    }


    openCategory(cetegoryId) {
        this.displayed = true;
        const category = this.categories[cetegoryId];
        this.currentCategory = category.filter(this.filterEnableBuilding);
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    filterEnableBuilding(buildings) {
        const required = buildings.required;
        if(!required) return true;
        for(let key in required) {
            if(stateManager.states[key] < required[key]) {
                return false;
            }
        }
        return true;
    }

    onClickBuilding(fct) {
        this._onClickBuilding = entityId => {
            this.currentFocus === entityId ? this.currentFocus = null : this.currentFocus = entityId;

            fct(entityId);
            ee.emit('onUpdate', 'buildingMenu', this);
        };
    }

    onClose(fct) {
        this._close = fct;
    }

    _onClickOpen() {
        this.open();
    }

    _onClickClose() {
        this.close();
    }

    _onClickBuilding() {
    }

    _onClickCategory(categoryId) {
        this.openCategory(categoryId)
    }

};
