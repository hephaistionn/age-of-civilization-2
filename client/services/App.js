const ee = require('./eventEmitter');

const Screen = require('./../View/Screen/Screen');

class App {

    constructor() {

        this.models = {};
        this.model = null;
        this.view = new Screen();
        this.requestAnimation = null;

        for(let i = 0; i < arguments.length; i++) {
            this.models[arguments[i].name] = arguments[i];
        }

        ee.on('mouseDown', this.mouseDown.bind(this));
        ee.on('mouseMovePress', this.mouseMovePress.bind(this));
        ee.on('mouseMove', this.mouseMove.bind(this));
        ee.on('mouseClick', this.mouseClick.bind(this));
        ee.on('mouseUp', this.mouseUp.bind(this));
        ee.on('mouseWheel', this.mouseWheel.bind(this));
        ee.on('mouseMoveOnMap', this.mouseMoveOnMap.bind(this));
        ee.on('mouseMoveOnMapPress', this.mouseMoveOnMapPress.bind(this));
        ee.on('mouseDownOnMap', this.mouseDownOnMap.bind(this));
        ee.on('newEntity', this.newEntity.bind(this));
        ee.on('removeEntity', this.removeEntity.bind(this));

    }

    hideScreen() {
        this._stop();
        this.view.dismount(this.model);
        this.model.dismount();
        this.model = null;
    }

    showScreen(id) {
        this.model = new this.models[id]();
        this.view.mount(this.model);
        this._start();
    }

    _start() {
        const that = this;
        let time;
        var update = function update() {
            that.requestAnimation = requestAnimationFrame(update);
            const now = new Date().getTime();
            const dt = now - (time || now);
            time = now;
            Math.min(dt,500);
            that._update(dt);
        };

        update();
    }

    _stop() {
        cancelAnimationFrame(this.requestAnimation);
    }

    _update(dt) {
        this.model.update(dt);
        this.view.update(dt, this.model);
    }

    mouseDown(x, z) {
        if(this.model.mouseDown)
            this.model.mouseDown(x, z);
    }

    mouseClick(x, z, model) {
        if(this.model.mouseClick)
            this.model.mouseClick(x, z, model);
    }

    mouseUp(x, z) {
        if(this.model.mouseUp)
            this.model.mouseUp(x, z);
    }

    mouseMovePress(x, z) {
        if(this.model.mouseMovePress)
            this.model.mouseMovePress(x, z);
    }

    mouseMove(x, z) {
        if(this.model.mouseMove)
            this.model.mouseMove(x, z);
    }

    mouseWheel(delta) {
        if(this.model.mouseWheel)
            this.model.mouseWheel(delta);
    }

    mouseMoveOnMap(x, z) {
        if(this.model.mouseMoveOnMap)
            this.model.mouseMoveOnMap(x, z);
    }

    mouseMoveOnMapPress(x, z) {
        if(this.model.mouseMoveOnMapPress)
            this.model.mouseMoveOnMapPress(x, z);
    }

    mouseDownOnMap(x, z) {
        if(this.model.mouseDownOnMap)
            this.model.mouseDownOnMap(x, z);
    }

    newEntity(config) {
        if(this.model.newEntity)
            this.model.newEntity(config);
    }

    removeEntity(entity) {
        if(this.model.removeEntity)
            this.model.removeEntity(entity);
    }
}

module.exports = App;
