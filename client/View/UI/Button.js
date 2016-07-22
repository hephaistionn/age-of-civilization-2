module.exports = class Button {

    constructor(model) {
        this.type = 'UI';
        this.node = document.createElement('div');
        this.node.className = 'button';
        model.needUpdate = true;
        this.updateState(model);
    }

    updateState(model) {
        if(model.needUpdate) {
            this.node.textContent = model.text || 'text';
            this.node.onclick = model.fct;
            model.needUpdate = false;
        }
    }

    update() {

    }

};
