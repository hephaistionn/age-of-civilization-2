const ee = require('../../services/eventEmitter');

module.exports = class EditorPanel {

    constructor() {
        this.displayed = false;
        this.entityEditor = false;
        this.roadeEditor = false;
        this.eraseEditor = false;
        this.type = 'UI';
    }

    open() {
        this.displayed = true;
        ee.emit('onUpdate', 'editorPanel', this);
    }

    showEntityEditor() {
        this.entityEditor = true;
        ee.emit('onUpdate', 'editorPanel', this);
    }

    showDeletionEditor() {
        this.eraseEditor = true;
        ee.emit('onUpdate', 'editorPanel', this);
    }

    showRoadeEditor() {
        this.roadeEditor = true;
        ee.emit('onUpdate', 'editorPanel', this);
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
        ee.emit('onUpdate', 'editorPanel', this);
    }


};
