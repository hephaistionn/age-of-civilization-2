const ee = require('../../services/eventEmitter');

module.exports = class EditorPanel {

    constructor() {
        this.displayed = false;
        this.entityEditor = false;
        this.roadeEditor = false;
        this.eraseEditor = false;
        this.updated = true;
        this.type = 'UI';

    }

    open() {
        this.displayed = true;
        this.updated = true;
    }

    showEntityEditor() {
        this.entityEditor = true;
        this.updated = true;
    }

    showDeletionEditor() {
        this.eraseEditor = true;
        this.updated = true;
    }

    showRoadeEditor() {
        this.roadeEditor = true;
        this.updated = true;
    }

    onConfirm(fct) {
        this._onConfirm = () => {
            this._hide();
            fct();
        };
    }

    onRotate(fct) {
        this._onRotate = fct;
    }

    onCancel(fct) {
        this._onCancel = () => {
            this._hide();
            fct();
        };
    }

    _hide() {
        this.displayed = false;
        this.entityEditor = false;
        this.roadeEditor = false;
        this.eraseEditor = false;
        this.updated = true;
    }


};
