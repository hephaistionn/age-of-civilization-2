module.exports = class BuildingMenu {

    constructor(model) {
        this.type = 'UI';

        this.canvas = document.getElementById('D3');

        this.node = document.createElement('div');
        this.node.className = 'buildingMenu mobile';

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

        this.nodeEditor = document.createElement('div');
        this.nodeEditor.className = 'editor hide';
        this.node.appendChild(this.nodeEditor);

        this.nodeButtonConstruct = document.createElement('div');
        this.nodeButtonConstruct.className = 'button construct';
        this.nodeButtonConstruct.textContent = 'ok';
        this.nodeButtonConstruct.onclick = model._onConstructEditor.bind(model);
        this.nodeEditor.appendChild(this.nodeButtonConstruct);

        this.nodeCancelConstruct = document.createElement('div');
        this.nodeCancelConstruct.className = 'button cancel';
        this.nodeCancelConstruct.textContent = 'X';
        this.nodeCancelConstruct.onclick = model._onCancelEditor.bind(model);
        this.nodeEditor.appendChild(this.nodeCancelConstruct);

        this.nodeRotationConstruct = document.createElement('div');
        this.nodeRotationConstruct.className = 'button rotate';
        this.nodeRotationConstruct.textContent = 'Rotate';
        this.nodeRotationConstruct.onclick = model._onRotationEditor.bind(model);
        this.nodeEditor.appendChild(this.nodeRotationConstruct);


        this.nodeButtonRoad = document.createElement('div');
        this.nodeButtonRoad.className = 'button road';
        this.nodeButtonRoad.textContent = 'ok';
        this.nodeButtonRoad.onclick = model._onCancelEditor.bind(model);
        this.node.appendChild(this.nodeButtonRoad);

        this.nodeButtonErase = document.createElement('div');
        this.nodeButtonErase.className = 'button erase';
        this.nodeButtonErase.textContent = 'ok';
        this.nodeButtonErase.onclick = model._onCancelEditor.bind(model);
        this.node.appendChild(this.nodeButtonErase);

        this.updateState(model);

    }

    updateState(model) {

        this.hideNode(this.nodeButtonOpen);
        this.hideNode(this.nodeBuildingsContainer);
        this.hideNode(this.nodeButtonClose);
        this.hideNode(this.nodeEditor);
        this.hideNode(this.nodeButtonRoad);
        this.hideNode(this.nodeButtonErase);

        if(model.entityEditor) {
            this.showNode(this.nodeEditor);
            return;
        }

        if(model.roadEditor) {
            this.showNode(this.nodeButtonRoad);
            return;
        }

        if(model.eraseEditor) {
            this.showNode(this.nodeButtonErase);
            return;
        }

        if(model.displayed) {
            this.hideNode(this.nodeEditor);
            this.hideNode(this.nodeButtonRoad);
            this.hideNode(this.nodeButtonOpen);
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
            this.hideNode(this.nodeEditor);
            this.hideNode(this.nodeButtonRoad);
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
