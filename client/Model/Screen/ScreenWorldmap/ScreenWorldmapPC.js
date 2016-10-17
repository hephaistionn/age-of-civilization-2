const ee = require('../../../services/eventEmitter');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const PixelMap = require('../../../services/PixelMap');

const WorldmapMenu = require('../../UI/WorldmapMenu');

let moveDx = 0;
let moveDz = 0;


class ScreenWorldmap {

    constructor() {
        console.log('ScreenWorldmap');
        this.camera = new Camera({
            x: 100, y: 40, z: 70,
            offsetX: 0.0001,
            offsetY: -40,
            offsetZ: -30,
            zoomMax: 70,
            zoomMin: 20
        });
        this.light = new Light({
            offsetX: -10,
            offsetY: -40,
            offsetZ: -10,
            ambient: 0x776666
        });

        this.worldmapMenu = new WorldmapMenu();

        const pixelMap = new PixelMap();
        pixelMap.compute('map/worldmap3.png', (dataMap)=> {
            console.log('rebuild worldmap3');
            this.worldmap = new Worldmap(dataMap);
            this.camera.setMapBorder(dataMap);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
            ee.emit('onUpdate', 'worldmap', this.worldmap);
            ee.emit('onUpdate', 'light', this.light);
        });

        ee.emit('onUpdate', 'render', 0x54b2e5);
    }

    update(dt) {
        if(this.worldmap) {
            this.worldmap.update(dt);
        }

        if(moveDx !== 0 || moveDz !== 0) {
            this.camera.moveTo(moveDx, moveDz, dt);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
            ee.emit('onUpdate', 'camera', this.camera);
            ee.emit('onUpdate', 'light', this.light);
        }
    }

    mouseMovePress(x, z) {
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    mouseUp() {
        this.camera.cleatMove();
    }

    mouseLeave(dx, dy) {
        moveDx = dx;
        moveDz = dy;
    }

    mouseEnter() {
        moveDx = 0;
        moveDz = 0;
    }

    mouseWheel(delta) {
        this.camera.mouseWheel(delta);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    dismount() {
        this.camera = null;
    }
}

module.exports = ScreenWorldmap;
