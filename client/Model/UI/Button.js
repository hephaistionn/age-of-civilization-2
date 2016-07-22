module.exports = class Button {

    constructor(config) {
        this.type = 'UI';
        this.needUpdate = false;
        this.setText(config.text);
    }

    setText(text) {
        this.text = text || 'button';
        this.needUpdate = true;
    }

    onClick(fct) {
        this.fct = fct;
        this.needUpdate = true;
    }

};
