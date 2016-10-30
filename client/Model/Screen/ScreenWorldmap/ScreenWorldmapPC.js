const ee = require('../../../services/eventEmitter');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const PixelMap = require('../../../services/PixelMap');

const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');

let moveDx = 0;
let moveDz = 0;

class ScreenWorldmap {

    constructor() {

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
            offsetZ: -10
        });

        this.worldmapMenu = new WorldmapMenu();
        this.entityManagerPanel = new EntityManagerPanel();

        const pixelMap = new PixelMap();
        pixelMap.compute('map/worldmap3.png', (dataMap)=> {
            this.worldmap = new Worldmap(dataMap);
            this.camera.setMapBorder(dataMap);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
            ee.emit('onUpdate', 'worldmap', this.worldmap);
            ee.emit('onUpdate', 'light', this.light);
        });
    }

    newCity(x, y, z, level, name) {
        const params = {level: level, x: x, y: y, z: z, name: name, type: 'mesopotamia'};
        this.worldmap.newCity(params);
        ee.emit('onUpdate', 'worldmap', this.worldmap);
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

    mouseClick(x, z, model) {
        if(this.worldmapMenu.constructMode) {
            const y = this.worldmap.getHeightTile(x, z);
            this.newCity(x, y, z, 1, 'myCity');
            ee.emit('onUpdate', 'worldmap', this.worldmap);
        }else if(model){
            this.entityManagerPanel.open(model);
        }
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
