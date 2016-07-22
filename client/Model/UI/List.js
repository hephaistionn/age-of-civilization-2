module.exports = class List {

    constructor(config) {
        this.type = 'UI';
        this.needUpdate = false;
        this.setWidth(config.width);
        this.setHeight(config.height);
        config.display ? this.show() : this.hide()
    }

    setChild(child) {
        this.children.push(child);
        this.needUpdate = true;
    }

    setWidth(width) {
        this.width = (width || 0);
        this.needUpdate = true;
    }

    setHeight(height) {
        this.height = (height || 0);
        this.needUpdate = true;
    }

    show() {
        this.display = true;
        this.needUpdate = true;
    }

    hide() {
        this.display = false;
        this.needUpdate = true;
    }
};