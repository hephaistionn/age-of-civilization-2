module.exports = class BuildingMenu {

    constructor(model) {
        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'buildingMenu';

        this.nodeButtonOpen = document.createElement('div');
        this.nodeButtonOpen.className = 'button open';
        this.nodeButtonOpen.textContent = model.labelButtonOpen;
        this.nodeButtonOpen.onclick = model._onClickOpen.bind(model);
        this.node.appendChild(this.nodeButtonOpen);

        this.nodeButtonClose = document.createElement('div');
        this.nodeButtonClose.className = 'button close';
        this.nodeButtonClose.textContent = model.labelButtonClose;
        this.nodeButtonClose.onclick = model._onClickClose.bind(model);
        this.node.appendChild(this.nodeButtonClose);

        this.nodeGroupCategory = document.createElement('div');
        this.nodeGroupCategory.className = 'group category';
        this.node.appendChild(this.nodeGroupCategory);

        this.nodeGroupBuildings = document.createElement('div');
        this.nodeGroupBuildings.className = 'group buildings';
        this.node.appendChild(this.nodeGroupBuildings);

        for(let categoryId in model.categories) {
            const nodeButtonCategory = document.createElement('div');
            nodeButtonCategory.className = 'button category ' + categoryId;
            nodeButtonCategory.textContent = categoryId;
            nodeButtonCategory.onclick = model._onClickCategory.bind(model, categoryId);
            this.nodeGroupCategory.appendChild(nodeButtonCategory);
        }
        this.updateState(model);
    }

    updateState(model) {

        if(model.displayed) {
            this.hideNode(this.nodeButtonOpen);
            this.showNode(this.nodeButtonClose);
            if(model.currentCategory.length) {
                this.computeCurrentCategory(model.currentCategory, model);
                this.showNode(this.nodeGroupBuildings);
                this.hideNode(this.nodeGroupCategory);
            } else {
                this.showNode(this.nodeGroupCategory);
                this.hideNode(this.nodeGroupBuildings);
            }
        } else {
            this.showNode(this.nodeButtonOpen);
            this.hideNode(this.nodeButtonClose);
            this.hideNode(this.nodeGroupCategory);
            this.hideNode(this.nodeGroupBuildings);
        }
    }

    computeCurrentCategory(modelBuildings, model) {

        while(this.nodeGroupBuildings.firstChild) {
            this.nodeGroupBuildings.removeChild(this.nodeGroupBuildings.firstChild);
        }

        for(let i = 0; i < modelBuildings.length; i++) {
            const modelBilding = modelBuildings[i];
            const nodeButtonBuilding = document.createElement('div');
            nodeButtonBuilding.className = 'button building ' + modelBilding.id;
            if(model.currentFocus === modelBilding.id) {
                nodeButtonBuilding.className += ' focus';
            }
            nodeButtonBuilding.textContent = modelBilding.id;
            nodeButtonBuilding.onclick = model._onClickBuilding.bind(model, modelBilding.id);
            this.nodeGroupBuildings.appendChild(nodeButtonBuilding);
        }
    }

    computeButtonRemove() {

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

    update() {

    }
};
