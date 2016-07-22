module.exports = class Picture {

    constructor(config) {
        this.type = 'UI';
        this.needUpdate = false;
        this.setWidth(config.width);
        this.setHeight(config.height);
        this.serSrc(config.src);
    }

    setWidth(width) {
        this.width = (width || 0);
        this.needUpdate = true;
    }

    setHeight(height) {
        this.height = (height || 0);
        this.needUpdate = true;
    }

    serSrc(src) {
        this.src = src;
        this.needUpdate = true;
    }

};
