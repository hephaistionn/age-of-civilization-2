module.exports = class BuildingMenu {

    constructor(model) {
        this.model = model;

        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'buildingMenu pc';

        this.nodeCategoriesContainer = document.createElement('div');
        this.nodeCategoriesContainer.className = 'categoriesContainer';
        this.node.appendChild(this.nodeCategoriesContainer);

        this.buildingContainer = document.createElement('div');
        this.buildingContainer.className = 'buildingContainer';
        this.node.appendChild(this.buildingContainer);

        for(let categoryId in model.categories) {
            const nodeButtonCategory = document.createElement('div');
            nodeButtonCategory.className = 'item ' + categoryId;
            nodeButtonCategory.textContent = categoryId;
            nodeButtonCategory.onclick = this.onClickCategory.bind(this, categoryId);
            this.nodeCategoriesContainer.appendChild(nodeButtonCategory);
        }
        this.updateState(model);
    }

    updateState(model) {

        model.displayed ? this.open() : this.close();

        if(model.currentCategory.length) {
            this.computeCurrentCategory(model.currentCategory, model);
        }
    }

    computeCurrentCategory(modelBuildings, model) {

        while(this.buildingContainer.firstChild) {
            this.buildingContainer.removeChild(this.buildingContainer.firstChild);
        }

        for(let i = 0; i < modelBuildings.length; i++) {
            const modelBuilding = modelBuildings[i];
            const nodeButtonBuilding = document.createElement('div');
            nodeButtonBuilding.className = 'item ' + modelBuilding.id;
            if(model.currentFocus === modelBuilding.id) {
                nodeButtonBuilding.className += ' focus';
            }
            nodeButtonBuilding.textContent = modelBuilding.id;
            nodeButtonBuilding.onclick = model._onClickBuilding.bind(model, modelBuilding.id);
            this.buildingContainer.appendChild(nodeButtonBuilding);
        }
    }

    onClickCategory(categoryId) {
        this.model._onClickCategory(categoryId);
        this.selectCategory(categoryId);
    }

    selectCategory(categoryId) {
        const focus = ' focus';
        const empty = '';
        this.nodeCategoriesContainer.childNodes.forEach((node)=> {
            node.className = node.className.replace(focus, empty);
            if(node.className.indexOf(categoryId) !== -1) {
                node.className += ' focus';
            }
        });
    }

    blurCategory(categoryId) {
        const focus = ' focus';
        const empty = '';
        this.nodeCategoriesContainer.childNodes.forEach((node)=> {
            node.className = node.className.replace(focus, empty);
        });
    }

    open() {
        const index = this.node.className.indexOf('hide');
        if(index !== -1) {
            this.node.className = this.node.className.replace(' hide', '');
        }
    }

    close() {
        if(this.node.className.indexOf('hide') === -1) {
            this.node.className += ' hide';
        }
        this.blurCategory();
    }

    update() {
    }
};
