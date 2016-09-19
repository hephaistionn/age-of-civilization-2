const ee = require('../../services/eventEmitter');
const THREE = require('../../services/threejs');

module.exports = Component => {

    Component.prototype.initObservers = function initObservers() {
        this.canvas.addEventListener('touchstart', this._touchStart.bind(this));
        this.canvas.addEventListener('touchend', this._touchEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this._touchCancel.bind(this));
        this.canvas.addEventListener('touchleave', this._touchleave.bind(this));
        this.canvas.addEventListener('touchmove', this._touchMove.bind(this));
        window.addEventListener('resize', this._resize.bind(this), false);
        this.selected = false;
        ee.on('onUpdate', this.updateComponent.bind(this));
    };

    Component.prototype._resize = function _resize(e) {
        this.canvas.style = '';
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.resize(width, height);
        this.render.resize(width, height);
    };

    Component.prototype._touchStart = function _touchStart(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        let point = this.getPointOnMapCameraRelative(touch.clientX, touch.clientY);
        ee.emit('touchStart',  point.x, point.z);
        this.selected = this.touchSelected(touch.clientX, touch.clientY);
        point = this.getPointOnMap(touch.clientX,touch.clientY);
        ee.emit('touchStartOnMap', point.x, point.z);
    };
    Component.prototype._touchEnd = function _touchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        ee.emit('touchEnd', touch.clientX,touch.clientY);
        this.selected = false;
    };
    Component.prototype._touchCancel = function _touchCancel(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        ee.emit('touchCancel', touch.clientX,touch.clientY);
    };
    Component.prototype._touchleave = function _touchleave(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        ee.emit('touchleave', touch.clientX,touch.clientY);
    };
    Component.prototype._touchMove = function _touchMove(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        let point = this.getPointOnMap(touch.clientX,touch.clientY);
        if(this.selected){
            ee.emit('touchDragg', point.x, point.z, touch.clientX,touch.clientY);
        }else{
            ee.emit('touchMoveOnMap', point.x, point.z);
            point = this.getPointOnMapCameraRelative(touch.clientX, touch.clientY);
            ee.emit('touchMove', point.x, point.z);
        }
    };

};