module.exports = class Text {

    constructor(model) {
        this.type = 'UI';
        this.node = document.createElement('div');
        model.needUpdate = true;
        this.updateState(model);
    }

    updateState(model) {
        if(model.needUpdate) {
            this.node.textContent = model.text || 'text';
            this.node.className = 'text v' + (model.size || 1);
            this.node.onclick = model.fct;
            model.needUpdate = false;
        }
    }

    update() {
    }

};
