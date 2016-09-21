const ee = require('../../services/eventEmitter');
const THREE = require('../../services/threejs');

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


module.exports = Component => {
    Component.prototype.initObservers = function initObservers() {
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
    };

    Component.prototype._resize = function _resize(e) {
        this.canvas.style = '';
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.resize(width, height);
        this.render.resize(width, height);
    };

    Component.prototype._mouseDown = function _mouseDown(e) {

        if(event.button === 2) {
            ee.emit('mouseDownRight', e.offsetX, e.offsetY);
        } else {
            this.mousePress = true;
            this.pressX = e.offsetX;
            this.pressZ = e.offsetY;

            const point = this.getPointOnMapCameraRelative(e.offsetX, e.offsetY);
            if(!point) return;
            ee.emit('mouseDown', point.x, point.z);
            this._mouseCheckCollision(e.offsetX, e.offsetY);
        }
        e.preventDefault();
    };

    Component.prototype._mouseUp = function _mouseUp(e) {
        this.mousePress = false;
        //filter: detect if the user is moving the camera.
        if(Math.abs(this.pressX - e.offsetX) + Math.abs(this.pressZ - e.offsetY) < 50) {
            const point = this.getPointOnMap(e.offsetX, e.offsetY);
            ee.emit('mouseClick', point.x, point.z, point.model);
        } else {
            ee.emit('mouseUp', e.offsetX, e.offsetY);
        }
        e.preventDefault();
    };

    Component.prototype._mouseMove = function _mouseMove(e) {
        if(this.mousePress) {
            const point = this.getPointOnMapCameraRelative(e.offsetX, e.offsetY);
            ee.emit('mouseMovePress', point.x, point.z);
            this._mouseMoveOnMapPress(e.offsetX, e.offsetY);
        } else {
            ee.emit('mouseMove', e.offsetX, e.offsetY);
            this._mouseMoveOnMap(e.offsetX, e.offsetY);
        }
        e.preventDefault();
    };

    Component.prototype._mouseLeave = function _mouseLeave(e) {
        let rx = event.clientX - this.canvas.width / 2;
        let ry = event.clientY - this.canvas.height / 2;
        const l = Math.sqrt(rx * rx + ry * ry);
        rx /= l;
        ry /= l;
        ee.emit('mouseLeave', rx, ry);

        e.preventDefault();
    };

    Component.prototype._mouseEnter = function _mouseEnter(e) {

        ee.emit('mouseEnter');
        e.preventDefault();
    };

    Component.prototype._keypress = function _keypress(event) {
        arrowLeftPress = ARROW_LEFT === event.keyCode;
        arrowRightPress = ARROW_RIGHT === event.keyCode;
        arrowTopPress = ARROW_TOP === event.keyCode;
        arrowDownPress = ARROW_DOWN === event.keyCode;
        rKeyPress = RKEY === event.keyCode;
        if(rKeyPress) {
            ee.emit('mouseRotate', event.keyCode);
        }
        this.pressBorder();
        event.preventDefault();
    };


    Component.prototype._keyup = function _keyup(event) {
        arrowLeftPress = ARROW_LEFT === event.keyCode ? false : arrowLeftPress;
        arrowRightPress = ARROW_RIGHT === event.keyCode ? false : arrowRightPress;
        arrowTopPress = ARROW_TOP === event.keyCode ? false : arrowTopPress;
        arrowDownPress = ARROW_DOWN === event.keyCode ? false : arrowDownPress;
        rKeyPress = RKEY === event.keyCode ? false : arrowDownPress;
        this.pressBorder();
        event.preventDefault();
    };

    Component.prototype._mouseWheel = function _mouseWheel(e) {
        const delta = -Math.max(-2, Math.min(2, (e.wheelDelta || -e.detail)));
        ee.emit('mouseWheel', delta);
        e.preventDefault();
    };

    Component.prototype._mouseMoveOnMap = function _mouseMoveOnMap(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY);
        if(!point) return;
        ee.emit('mouseMoveOnMap', point.x, point.z);
    };

    Component.prototype._mouseMoveOnMapPress = function _mouseMoveOnMapPress(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY);
        if(!point) return;
        ee.emit('mouseMoveOnMapPress', point.x, point.z);
    };

    Component.prototype._mouseCheckCollision = function _mouseCheckCollision(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY);
        if(!point) return;
        ee.emit('mouseDownOnMap', point.x, point.z);
    };

    Component.prototype.pressBorder = function pressBorder() {
        if(arrowLeftPress) {
            if(arrowDownPress) {
                ee.emit('mouseBorder', -1, 1);
            } else if(arrowTopPress) {
                ee.emit('mouseBorder', -1, -1);
            } else {
                ee.emit('mouseBorder', -1, 0);
            }
        } else if(arrowRightPress) {
            if(arrowDownPress) {
                ee.emit('mouseBorder', 1, 1);
            } else if(arrowTopPress) {
                ee.emit('mouseBorder', 1, -1);
            } else {
                ee.emit('mouseBorder', 1, 0);
            }
        } else {
            if(arrowDownPress) {
                ee.emit('mouseBorder', 0, 1);
            } else if(arrowTopPress) {
                ee.emit('mouseBorder', 0, -1);
            } else {
                ee.emit('mouseBorder', 0, 0);
            }
        }
    };

};
