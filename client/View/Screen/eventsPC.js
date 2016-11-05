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


module.exports = Screen => {

    Screen.prototype.initObservers = function initObservers() {
        this.events.__mouseDown = this._mouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.events.__mouseDown);
        this.events.__mouseUp = this._mouseUp.bind(this);
        this.canvas.addEventListener('mouseup', this.events.__mouseUp);
        this.events.__mouseMove = this._mouseMove.bind(this);
        this.canvas.addEventListener('mousemove', this.events.__mouseMove);
        this.events.__mouseWheel = this._mouseWheel.bind(this);
        this.canvas.addEventListener('mousewheel', this.events.__mouseWheel);
        this.events.__mouseEnter = this._mouseEnter.bind(this);
        this.container.addEventListener('mouseenter', this.events.__mouseEnter);
        this.events.__mouseLeave = this._mouseLeave.bind(this);
        this.container.addEventListener('mouseleave', this.events.__mouseLeave);
        this.events.__keypress = this._keypress.bind(this);
        document.addEventListener('keydown', this.events.__keypress);
        this.events.__keyup = this._keyup.bind(this);
        document.addEventListener('keyup', this.events.__keyup);
        this.events.__resize = this._resize.bind(this);
        window.addEventListener('resize', this.events.__resize, false);
        this.events.__updateComponent = this.updateComponent.bind(this);
        ee.on('onUpdate', this.events.__updateComponent);
    };

    Screen.prototype.removeObservers = function removeObservers() {
        this.canvas.removeEventListener('mousedown', this.events.__mouseDown);
        this.canvas.removeEventListener('mouseup', this.events.__mouseUp);
        this.canvas.removeEventListener('mousemove', this.events.__mouseMove);
        this.canvas.removeEventListener('mousewheel', this.events.__mouseWheel);
        this.container.removeEventListener('mouseenter', this.events.__mouseEnter);
        this.container.removeEventListener('mouseleave', this.events.__mouseLeave);
        document.removeEventListener('keydown', this.events.__keypress);
        document.removeEventListener('keyup', this.events.__keyup);
        window.removeEventListener('resize', this.events.__resize);
        ee.off('onUpdate', this.events.__updateComponent);
    };

    Screen.prototype._resize = function _resize(e) {
        this.canvas.style = '';
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.resize(width, height);
        this.render.resize(width, height);
    };

    Screen.prototype._mouseDown = function _mouseDown(e) {

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

    Screen.prototype._mouseUp = function _mouseUp(e) {
        this.mousePress = false;
        //filter: detect if the user is moving the camera.
        if(Math.abs(this.pressX - e.offsetX) + Math.abs(this.pressZ - e.offsetY) < 50) {
            const point = this.getPointOnMap(e.offsetX, e.offsetY, true);
            if(!point) return;
            ee.emit('mouseClick', point.x, point.z, point.model);
        } else {
            ee.emit('mouseUp', e.offsetX, e.offsetY);
        }
        e.preventDefault();
    };

    Screen.prototype._mouseMove = function _mouseMove(e) {
        if(this.mousePress) {
            const point = this.getPointOnMapCameraRelative(e.offsetX, e.offsetY, false);
            if(!point) return;
            ee.emit('mouseMovePress', point.x, point.z);
            this._mouseMoveOnMapPress(e.offsetX, e.offsetY);
        } else {
            ee.emit('mouseMove', e.offsetX, e.offsetY);
            this._mouseMoveOnMap(e.offsetX, e.offsetY);
        }
        e.preventDefault();
    };

    Screen.prototype._mouseLeave = function _mouseLeave(e) {
        const midScreenW = this.canvas.width / 2;
        const midScreenH = this.canvas.height / 2;
        let rx = event.clientX - midScreenW;
        let ry = event.clientY - midScreenH;
        rx = Math.abs(rx) > midScreenW * 0.5 ? Math.sign(rx) : 0;
        ry = Math.abs(ry) > midScreenH * 0.5 ? Math.sign(ry) : 0;
        ee.emit('mouseLeave', rx, ry);
        e.preventDefault();
    };

    Screen.prototype._mouseEnter = function _mouseEnter(e) {

        ee.emit('mouseEnter');
        e.preventDefault();
    };

    Screen.prototype._keypress = function _keypress(event) {
        arrowLeftPress = ARROW_LEFT === event.keyCode;
        arrowRightPress = ARROW_RIGHT === event.keyCode;
        arrowTopPress = ARROW_TOP === event.keyCode;
        arrowDownPress = ARROW_DOWN === event.keyCode;
        rKeyPress = RKEY === event.keyCode;
        if(rKeyPress) {
            ee.emit('mouseRotate', event.keyCode);
        }
        this.pressBorder();
        if(arrowTopPress || arrowDownPress) {
            event.preventDefault();
        }
    };


    Screen.prototype._keyup = function _keyup(event) {
        arrowLeftPress = ARROW_LEFT === event.keyCode ? false : arrowLeftPress;
        arrowRightPress = ARROW_RIGHT === event.keyCode ? false : arrowRightPress;
        arrowTopPress = ARROW_TOP === event.keyCode ? false : arrowTopPress;
        arrowDownPress = ARROW_DOWN === event.keyCode ? false : arrowDownPress;
        rKeyPress = RKEY === event.keyCode ? false : arrowDownPress;
        this.pressBorder();
        event.preventDefault();
    };

    Screen.prototype._mouseWheel = function _mouseWheel(e) {
        const delta = -Math.max(-2, Math.min(2, (e.wheelDelta || -e.detail)));
        ee.emit('mouseWheel', delta);
        e.preventDefault();
    };

    Screen.prototype._mouseMoveOnMap = function _mouseMoveOnMap(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY, false);
        if(!point) return;
        ee.emit('mouseMoveOnMap', point.x, point.z);
    };

    Screen.prototype._mouseMoveOnMapPress = function _mouseMoveOnMapPress(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY, false);
        if(!point) return;
        ee.emit('mouseMoveOnMapPress', point.x, point.z);
    };

    Screen.prototype._mouseCheckCollision = function _mouseCheckCollision(screenX, screenY) {
        const point = this.getPointOnMap(screenX, screenY, true);
        if(!point) return;
        ee.emit('mouseDownOnMap', point.x, point.z);
    };

    Screen.prototype.pressBorder = function pressBorder() {
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
