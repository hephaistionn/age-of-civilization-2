const stateManager = require('../../../services/stateManager');

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

        this.nodeButtonConstruct = document.createElement('div');
        this.nodeButtonConstruct.className = 'button construct';
        this.nodeButtonConstruct.textContent = 'Construct';
        this.nodeButtonConstruct.onclick = model.switchConstrucMode.bind(model);
        this.node.appendChild(this.nodeButtonConstruct);

        this.updateState(model);
    }

    updateState(model) {
        if(model.constructMode) {
            this.nodeButtonConstruct.className = 'button construct focus';
        } else {
            this.nodeButtonConstruct.className = 'button construct';
        }
    }

    update() {
    }
};
