module.exports = class List {

    constructor(model) {
        this.type = 'UI';
        this.node = document.createElement('div');
        this.node.className = 'list';
        this.children = [];
        model.needUpdate = true;
        this.updateState(model);
    }

    updateState(model) {
        if(model.needUpdate) {
            this.removeChild();
            this.node.style.width = (model.width || 0) + 'px';
            this.node.style.height = (model.height || 0) + 'px';
            this.node.style.display = model.display ? 'block' : 'none';
            for(let i = 0; i < model.children.length; i++) {
                let childModel = model.children[i];
                let classComponent = childModel.constructor.name;
                this.children[i] = new Component[classComponent](childModel, this.node);
            }
        } else {
            for(let i = 0; i < model.children.length; i++) {
                let childModel = model.children[i];
                if(childModel.needUpdate) {
                    this.children[i].updateState(childModel);
                }
            }
        }
        model.needUpdate = false;
    }

    update() {

    }

    removeChild() {
        for(let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            this.node.removeChild(child);
        }
        this.children = [];
    }

};