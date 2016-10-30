const stateManager = require('../../../Model/stateManager');

module.exports = class EntityManagerPanel {

    constructor(model) {
        this.model = model;

        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'entityManagerPanel pc nodeOverlay';

        this.nodePanel = document.createElement('div');
        this.nodePanel.className = 'panel';
        this.node.appendChild(this.nodePanel);

        this.nodeButtonBack = document.createElement('div');
        this.nodeButtonBack.className = 'button close';
        this.nodeButtonBack.textContent = 'close';
        this.nodeButtonBack.onclick = model.close.bind(model);
        this.nodePanel.appendChild(this.nodeButtonBack);

        this.nodeDescription = null;

        this.updateState(model);
    }

    updateState(model) {
        if(model.opened) {
            this.nodeDescription = document.createElement('div');
            this.nodeDescription.className = 'description';
            this.nodeDescription.textContent = model.description;
            this.nodePanel.appendChild(this.nodeDescription);
            this.node.className = this.node.className.replace(' hide', '');
        } else {
            this.node.className += ' hide';
            if(this.nodeDescription)
                this.nodePanel.removeChild(this.nodeDescription);
        }
    }

    update() {
    }
};
