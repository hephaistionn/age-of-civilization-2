module.exports = class Picture {

    constructor(model) {
        this.type = 'UI';
        this.node = document.createElement('div');
        model.needUpdate = true;
        this.updateState(model);
    }

    updateState(model) {
        if(model.needUpdate) {
            this.node.style.backgroundImage = 'url(' + model.src + ')';
            this.node.style.width = (model.width || 100) + 'px';
            this.node.style.height = (model.height || 100) + 'px';
            this.node.className = 'picture';
            model.needUpdate = false;
        }
    }

    update() {
    }


};

