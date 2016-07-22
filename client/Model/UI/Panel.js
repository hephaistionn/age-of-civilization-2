module.exports = class Panel {

    constructor(config) {
        this.type = 'UI';
        this.needUpdate = false;
        this.children = [];
        this.setWidth(config.width);
        this.setHeight(config.height);
        this.x = config.x || 0;
        this.y = config.y || 0;
        if(config.display === undefined) {
            config.display = true;
        }

        config.display ? this.show() : this.hide()
    }

    setChild(child) {
        this.children.push(child);
        this.needUpdate = true;
    }

    removeChildren() {
        this.children = [];
        this.needUpdate = true;
    }

    removeChild(children) {
        if(!children) return;
        const index = this.children.indexOf(children);
        this.children.splice(index, 1);
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
