const Components = {
    Text: require('./Text'),
    Button: require('./Button'),
    Picture: require('./Picture')
};


class Panel {

    constructor(model) {
        this.type = 'UI';
        this.node = document.createElement('div');
        this.node.className = 'panel';
        this.children = [];
        model.needUpdate = true;
        this.updateState(model);
    }

    updateState(model) {
        if(model.needUpdate) {
            this.removeChild();
            this.node.style.width = (model.width || 0) + 'px';
            this.node.style.height = (model.height || 0) + 'px';
            this.node.style.top = (model.y || 0) + 'px';
            this.node.style.left = (model.x || 0) + 'px';
            this.node.style.display = model.display ? 'block' : 'none';
            for(let i = 0; i < model.children.length; i++) {
                let childModel = model.children[i];
                let classComponent = childModel.constructor.name;
                this.children[i] = new Components[classComponent](childModel);
                this.node.appendChild(this.children[i].node)
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
        while(this.children.length) {
            let child = this.children.pop();
            this.node.removeChild(child.node);
        }
    }

}

Components.Panel = Panel;

module.exports = Panel;