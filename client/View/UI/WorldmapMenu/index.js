const stateManager = require('../../../Model/stateManager');

module.exports = class WorldmapMenu {

    constructor(model) {
        this.model = model;

        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'worldmapMenu pc';

        this.nodeButtonBack = document.createElement('div');
        this.nodeButtonBack.className = 'button back';
        this.nodeButtonBack.textContent = 'Back';
        this.nodeButtonBack.onclick = model.back.bind(model);
        this.node.appendChild(this.nodeButtonBack);

        this.updateState(model);
    }

    updateState(model) {

    }

    update() {
    }
};
