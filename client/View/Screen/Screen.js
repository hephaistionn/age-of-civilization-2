const ee = require('../../services/eventEmitter');
const THREE = require('../../services/threejs');

const COMPONENTS = {
    Map: require('./../Engine/Map'),
    Light: require('./../Engine/Light'),
    Camera: require('./../Engine/Camera'),
    Render: require('./../Engine/Render'),
    Panel: require('../UI/Panel'),
    Text: require('../UI/Text'),
    Button: require('../UI/Button'),
    Picture: require('../UI/Picture')
};

module.exports = class Screen {

    constructor() {
        this.canvas = document.getElementById('D3');
        this.dom = document.getElementById('UI');
        this.render = new COMPONENTS.Render(this.canvas);
        this.mousePress = false;

        this.initObservers();

    }

    mount(model) {
        for(let id in model) {
            this.newComponent(id, model[id]);
        }
    }

    dismount(model) {
        for(let id in model) {
            this.removeComponent(id)
        }
    }

    newComponent(id, model) {

        this[id] = new COMPONENTS[model.constructor.name](model);

        if(model.type === 'UI') {
            this.dom.appendChild(this[id].node);
        } else {
            this.render.addChild(this[id]);
        }
    }

    removeComponent(id) {
        if(this[id].type === 'UI') {
            this.dom.removeChild(this[id].node)
        } else {
            this[id].remove();
            this.render.removeChild(this[id])
        }
        delete this[id];
    }

    updateComponent(id, model) {
        if(this[id]) {
            if(model) {
                this[id].updateState(model);
            } else {
                this.removeComponent(id);
            }
        } else {
            this.newComponent(id, model);
        }
    }

    update(dt, model) {
        for(let id in model) {
            this[id].update(dt);
        }
        this.render.update();
    }

    initObservers() {
        this.dom.addEventListener('mousedown', this._mouseDown.bind(this));
        this.dom.addEventListener('mouseup', this._mouseUp.bind(this));
        this.dom.addEventListener('mousemove', this._mouseMove.bind(this));
        this.dom.addEventListener('mousewheel', this._mouseWheel.bind(this));

        window.addEventListener('resize', this._resize.bind(this), false);
        ee.on('onUpdate', this.updateComponent.bind(this));
    }

    _resize(e) {
        this.canvas.style = '';
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.resize(width, height);
        this.render.resize(width, height);
    }

    _mouseDown(e) {
        this.mousePress = true;
        ee.emit('mouseDown', e.clientX, e.clientY);
    }

    _mouseUp(e) {
        this.mousePress = false;
        ee.emit('mouseUp', e.clientX, e.clientY);
    }

    _mouseMove(e) {
        if(this.mousePress) {
            ee.emit('mouseMovePress', e.clientX, e.clientY);
        } else {
            ee.emit('mouseMove', e.clientX, e.clientY);
        }
    }

    _mouseWheel(e) {
        const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        ee.emit('mouseWheel', -delta);
    }

};
