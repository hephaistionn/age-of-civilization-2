const stateManager = require('../../../services/stateManager');

module.exports = class FirstStartPanel {

    constructor(model) {
        this.model = model;

        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'firstStartPanel pc nodeOverlay';

        this.nodePanel = document.createElement('div');
        this.nodePanel.className = 'panel';
        this.node.appendChild(this.nodePanel);

        this.nodeButtonOk = document.createElement('div');
        this.nodeButtonOk.className = 'button ok';
        this.nodeButtonOk.textContent = 'ok';
        this.nodeButtonOk.onclick = model.close;
        this.nodePanel.appendChild(this.nodeButtonOk);

        this.nodeMessage = document.createElement('div');
        this.nodeMessage.className = 'message';
        this.nodeMessage.textContent = model.message;
        this.nodePanel.appendChild(this.nodeMessage);

        this.updateState(model);
    }

    updateState(model) {

    }

    update() {
    }
};
