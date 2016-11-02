const stateManager = require('../../../services/stateManager');

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
        this.nodeVisitButton = null;

        this.updateState(model);
    }

    updateState(model) {
        if(model.opened) {
            if(model.description) this.createDescription(model);
            if(model.yourCity) this.createVisiteButton(model);
            this.node.className = this.node.className.replace(' hide', '');
        } else {
            this.node.className += ' hide';
            if(this.nodeDescription) this.nodePanel.removeChild(this.nodeDescription);
            if(this.nodeVisitButton) this.nodePanel.removeChild(this.nodeVisitButton);
        }
    }

    createDescription(model){
        this.nodeDescription = document.createElement('div');
        this.nodeDescription.className = 'description';
        this.nodeDescription.textContent = model.description;
        this.nodePanel.appendChild(this.nodeDescription);
    }

    createVisiteButton(model){
        this.nodeVisitButton = document.createElement('div');
        this.nodeVisitButton.className = 'button visit';
        this.nodeVisitButton.textContent = 'Go to';
        this.nodeVisitButton.onclick = model.visit.bind(model);
        this.nodePanel.appendChild(this.nodeVisitButton);
    }

    update() {
    }
};
