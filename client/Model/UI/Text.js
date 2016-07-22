const ee = require('./../../services/eventEmitter');

module.exports = class Text {

    constructor(config) {
        this.type = 'UI';
        this.needUpdate = false;
        this.setText(config.text);
        this.setClassName(config.className);
    }

    setText(text) {
        this.text = text || 'text';
        this.needUpdate = true;
    }

    setClassName(className) {
        this.className = className || '';
        this.needUpdate = true;
    }


};
