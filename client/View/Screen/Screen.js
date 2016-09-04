const ee = require('../../services/eventEmitter');
const THREE = require('../../services/threejs');

const COMPONENTS = {
    Map: require('./../Engine/Map'),
    Light: require('./../Engine/Light'),
    Camera: require('./../Engine/Camera'),
    Render: require('./../Engine/Render'),
    Positioner: require('./../Engine/Positioner'),
    RoadPositioner: require('./../Engine/RoadPositioner'),
    BuildingMenu: require('../UI/BuildingMenu')
};

module.exports = class Screen {

    constructor() {
        this.canvas = document.getElementById('D3');
        this.dom = document.getElementById('UI');
        this.render = new COMPONENTS.Render(this.canvas);
        this.mousePress = false;
        this.mouse = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.pressX = 0;
        this.pressZ = 0;

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
        this.canvas.addEventListener('mousedown', this._mouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this._mouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this._mouseMove.bind(this));
        this.canvas.addEventListener('mousewheel', this._mouseWheel.bind(this));
        this.canvas.addEventListener('onmouseenter', this._mouseLeave.bind(this));
        //this.canvas.addEventListener('onmouseout', this._mouseLeave.bind(this));

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
        this.pressX = e.offsetX;
        this.pressZ = e.offsetY;
        ee.emit('mouseDown', e.offsetX, e.offsetY);
        this._mouseCheckCollision(e.offsetX, e.offsetY);
    }

    _mouseUp(e) {
        this.mousePress = false;
        //filter: detect if the user is moving the camera.
        if(Math.abs(this.pressX - e.offsetX) + Math.abs(this.pressZ - e.offsetY) < 50) {
            const point = this.getPointOnMap(e.offsetX, e.offsetY);
            ee.emit('mouseClick', point.x, point.z, point.model);
        } else {
            ee.emit('mouseUp', e.offsetX, e.offsetY);
        }
    }

    _mouseMove(e) {
        if(this.mousePress) {
            ee.emit('mouseMovePress', e.offsetX, e.offsetY);
            this._mouseMoveOnMapPress(e.offsetX, e.offsetY);
        } else {
            ee.emit('mouseMove', e.offsetX, e.offsetY);
            this._mouseMoveOnMap(e.offsetX, e.offsetY);
        }
    }

    _mouseLeave(e) {
        this._mouseUp(e);
    }

    _mouseWheel(e) {
        const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        ee.emit('mouseWheel', -delta);
    }

    _mouseMoveOnMap(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY);
        ee.emit('mouseMoveOnMap', point.x, point.z);
    }

    _mouseMoveOnMapPress(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY);
        ee.emit('mouseMoveOnMapPress', point.x, point.z);
    }

    _mouseCheckCollision(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY);
        ee.emit('mouseDownOnMap', point.x, point.z);
    }

    getPointOnMap(screenX, screenY) {
        if(!this.map || !this.camera)return {x: 0, z: 0};
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        const intersects = this.raycaster.intersectObjects(this.map.chunksList, true);
        if(intersects.length) {
            const point = intersects[0].point;
            const tileSize = this.map.tileSize;
            point.x /= tileSize;
            point.z /= tileSize;
            const mesh = intersects[0].object;
            if(mesh.userData.model) {
                return {
                    model: mesh.userData.model,
                    x: point.x,
                    z: point.z
                }
            } else {
                return point;
            }

        } else {
            return {x: 0, z: 0};
        }
    }

};
