const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');
const ENTITIES = require('../Engine/Entity/listEntity');


module.exports = class BuildingMenu {

    constructor(config) {
        this.categories = {
            resource: ['Destroy'],
            factory: ['Destroy'],
            service: ['Destroy'],
            culture: ['EntityChurch', 'Destroy'],
            state: [
                'EntityHouse',
                'EntityChurch',
                'Road',
                'EntityExplorer',
                'Destroy',
                'Destroy']
        };
        this.currentCategory = [];
        this.currentCategoryId = '';
        this.currentFocus = null;
        this.displayed = true;
        this.isCollapsed = true;
        this.updated = false;
        this.type = 'UI';
    }

    open() {
        this.displayed = true;
        this.isCollapsed = true;
        this.updated = true;
    }

    close() {
        this.displayed = false;
        this.currentCategory = [];
        if(this._close)this._close();
        this.updated = true;
    }

    expand () {
        this.isCollapsed = false;
        this.updated = true;
    }

    collapse () {
        this.currentCategory = [];
        this.isCollapsed = true;
        this.updated = true;
    }


    openCategory(categoryId) {
        this.isCollapsed = false;
        this.currentCategoryId = categoryId;
        this.updateCurrentCategory();
        this.updated = true;
    }

    updateCurrentCategory() {
        const category = this.categories[this.currentCategoryId];
        if(!category) return;
        this.currentCategory = category.filter(this.filterEnableBuilding);
    }

    filterEnableBuilding(entityId) {
        const Entity = ENTITIES[entityId];
        if(!Entity) return true;
        return Entity.available();
    }

    onClickBuilding(fct) {
        this._onClickBuilding = entityId => {
            this.currentFocus === entityId ? this.currentFocus = null : this.currentFocus = entityId;
            fct(entityId);
            this.updated = true;
        };
    }

    _onClickExpand() {
        this.expand();
    }

    _onClickCollapse() {
        this.collapse();
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
