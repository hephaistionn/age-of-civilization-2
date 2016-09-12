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

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_TOP = 38;
const ARROW_DOWN = 40;
const RKEY = 82;

let arrowLeftPress = false;
let arrowRightPress = false;
let arrowTopPress = false;
let arrowDownPress = false;
let rKeyPress = false;

module.exports = class Screen {

    constructor() {
        this.canvas = document.getElementById('D3');
        this.dom = document.getElementById('UI');
        this.container = document.getElementById('container');
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
        this.container.addEventListener('mouseenter', this._mouseEnter.bind(this));
        this.container.addEventListener('mouseleave', this._mouseLeave.bind(this));
        document.addEventListener('keydown', this._keypress.bind(this));
        document.addEventListener('keyup', this._keyup.bind(this));

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

        if(event.button===2){
            ee.emit('mouseDownRight', e.offsetX, e.offsetY);
        }else{
            this.mousePress = true;
            this.pressX = e.offsetX;
            this.pressZ = e.offsetY;
            ee.emit('mouseDown', e.offsetX, e.offsetY);
            this._mouseCheckCollision(e.offsetX, e.offsetY);
        }

        e.preventDefault();
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
        e.preventDefault();
    }

    _mouseMove(e) {
        if(this.mousePress) {
            ee.emit('mouseMovePress', e.offsetX, e.offsetY);
            this._mouseMoveOnMapPress(e.offsetX, e.offsetY);
        } else {
            ee.emit('mouseMove', e.offsetX, e.offsetY);
            this._mouseMoveOnMap(e.offsetX, e.offsetY);
        }
        e.preventDefault();
    }

    _mouseLeave(e) {
        let rx = event.clientX - this.canvas.width/2;
        let ry = event.clientY - this.canvas.height/2;
        const l  = Math.sqrt(rx*rx+ry*ry);
        rx /=l;
        ry /=l;
        ee.emit('mouseLeave',rx,ry);

        e.preventDefault();
    }

    _mouseEnter(e) {

        ee.emit('mouseEnter');
        e.preventDefault();
    }

    _keypress(event){
        arrowLeftPress = ARROW_LEFT === event.keyCode;
        arrowRightPress = ARROW_RIGHT === event.keyCode;
        arrowTopPress = ARROW_TOP === event.keyCode;
        arrowDownPress = ARROW_DOWN === event.keyCode;
        rKeyPress = RKEY === event.keyCode;
        if(rKeyPress){
            ee.emit('mouseRotate',event.keyCode);
        }
        this.pressBorder();
        event.preventDefault();
    }


    _keyup(event){
        arrowLeftPress = ARROW_LEFT === event.keyCode ? false : arrowLeftPress;
        arrowRightPress = ARROW_RIGHT === event.keyCode ? false : arrowRightPress;
        arrowTopPress = ARROW_TOP === event.keyCode ? false : arrowTopPress;
        arrowDownPress = ARROW_DOWN === event.keyCode ? false : arrowDownPress;
        rKeyPress = RKEY === event.keyCode ? false : arrowDownPress;
        this.pressBorder();
        event.preventDefault();
    }

    _mouseWheel(e) {
        const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        ee.emit('mouseWheel', -delta);
        e.preventDefault();
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

    pressBorder(){
        if(arrowLeftPress){
            if(arrowDownPress){
                ee.emit('mouseBorder', -1, 1);
            }else if(arrowTopPress){
                ee.emit('mouseBorder', -1, -1);
            }else{
                ee.emit('mouseBorder', -1, 0);
            }
        }else if(arrowRightPress){
            if(arrowDownPress){
                ee.emit('mouseBorder', 1, 1);
            }else if(arrowTopPress){
                ee.emit('mouseBorder', 1, -1);
            }else{
                ee.emit('mouseBorder', 1, 0);
            }
        }else {
            if(arrowDownPress){
                ee.emit('mouseBorder', 0, 1);
            }else if(arrowTopPress){
                ee.emit('mouseBorder', 0, -1);
            }else{
                ee.emit('mouseBorder', 0, 0);
            }
        }
    }

};
