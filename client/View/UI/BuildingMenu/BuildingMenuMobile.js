module.exports = class BuildingMenu {

    constructor(model) {
        this.type = 'UI';

        this.canvas = document.getElementById('D3');

        this.node = document.createElement('div');
        this.node.className = 'buildingMenu mobile';

        this.nodeOverlay = document.createElement('div');
        this.nodeOverlay.className = 'nodeOverlay hide';
        this.node.appendChild(this.nodeOverlay);

        this.nodeCategoriesContainer = document.createElement('div');
        this.nodeCategoriesContainer.className = 'categoriesContainer';
        this.node.appendChild(this.nodeCategoriesContainer);

        this.nodeBuildingsContainer = document.createElement('div');
        this.nodeBuildingsContainer.className = 'buildingsContainer';
        this.node.appendChild(this.nodeBuildingsContainer);

        this.nodeBuildingsContent = document.createElement('div');
        this.nodeBuildingsContent.className = 'buildingsContent';
        this.nodeBuildingsContainer.appendChild(this.nodeBuildingsContent);

        for(let categoryId in model.categories) {
            const nodeButtonCategory = document.createElement('div');
            nodeButtonCategory.className = 'item ' + categoryId;
            nodeButtonCategory.textContent = categoryId;
            nodeButtonCategory.onclick = model._onClickCategory.bind(model, categoryId);
            this.nodeCategoriesContainer.appendChild(nodeButtonCategory);
        }

        this.nodeButtonOpen = document.createElement('div');
        this.nodeButtonOpen.className = 'button open';
        this.nodeButtonOpen.textContent = 'Build';
        this.nodeButtonOpen.onclick = model._onClickOpen.bind(model);
        this.node.appendChild(this.nodeButtonOpen);

        this.nodeButtonClose = document.createElement('div');
        this.nodeButtonClose.className = 'button close';
        this.nodeButtonClose.textContent = 'Close';
        this.nodeButtonClose.onclick = model._onClickClose.bind(model);
        this.node.appendChild(this.nodeButtonClose);

        this.updateState(model);

    }

    updateState(model) {

        this.hideNode(this.nodeButtonOpen);
        this.hideNode(this.nodeBuildingsContainer);
        this.hideNode(this.nodeButtonClose);

        if(model.displayed) {
            this.hideNode(this.nodeButtonOpen);
            this.showNode(this.nodeOverlay);
            this.showNode(this.nodeButtonClose);
            if(model.currentCategory.length) {
                this.computeCurrentCategory(model.currentCategory, model);
                this.showNode(this.nodeBuildingsContainer);
                this.hideNode(this.nodeCategoriesContainer);
            } else {
                this.showNode(this.nodeCategoriesContainer);
                this.hideNode(this.nodeBuildingsContainer);
            }
        } else {
            this.hideNode(this.nodeBuildingsContainer);
            this.showNode(this.nodeButtonOpen);
            this.hideNode(this.nodeButtonClose);
            this.hideNode(this.nodeCategoriesContainer);
            this.hideNode(this.nodeOverlay);
        }
    }

    computeCurrentCategory(modelBuildings, model) {

        while(this.nodeBuildingsContent.firstChild) {
            this.nodeBuildingsContent.removeChild(this.nodeBuildingsContent.firstChild);
        }

        for(let i = 0; i < modelBuildings.length; i++) {
            const id = modelBuildings[i];
            const nodeButtonBuilding = document.createElement('div');
            nodeButtonBuilding.className = 'item ' + id;
            if(model.currentFocus === id) {
                nodeButtonBuilding.className += ' focus';
            }
            nodeButtonBuilding.textContent = id;
            nodeButtonBuilding.onclick = model._onClickBuilding.bind(model, id);
            this.nodeBuildingsContent.appendChild(nodeButtonBuilding);
        }
    }

    showNode(node) {
        const index = node.className.indexOf('hide');
        if(index !== -1) {
            node.className = node.className.replace(' hide', '');
        }
    }

    hideNode(node) {
        if(node.className.indexOf('hide') === -1) {
            node.className += ' hide';
        }
    }

    update(dt) {

    }
};
