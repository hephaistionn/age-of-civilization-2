const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const PixelMap = require('../../../services/PixelMap');
const CityPositioner = require('../../Engine/CityPositioner');

const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const FirstStartPanel = require('../../UI/FirstStartPanel');
const LeaderCreationPanel = require('../../UI/LeaderCreationPanel');

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

        if(stateManager.firstBoot){
            this.firstStartPanel = new FirstStartPanel();
            this.firstStartPanel.onClose(()=>{
                delete this.firstStartPanel;
                ee.emit('onUpdate', 'firstStartPanel');
                this.leaderCreationPanel = new LeaderCreationPanel();
                ee.emit('onUpdate', 'leaderCreationPanel', this.leaderCreationPanel );
                this.leaderCreationPanel.onClose( params => {
                    stateManager.newLeader(params);
                    delete this.leaderCreationPanel;
                    ee.emit('onUpdate', 'leaderCreationPanel');
                });
            });
        }

        const pixelMap = new PixelMap();
        pixelMap.compute('map/worldmap3.png', (dataMap)=> {
            this.worldmap = new Worldmap(dataMap);
            this.camera.setMapBorder(dataMap);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
            this.cityPositioner = new CityPositioner(dataMap);

            const cities = stateManager.getCities();
            cities.map(city => {
                this.worldmap.addCity(city);
            });
            ee.emit('onUpdate', 'light', this.light);
            ee.emit('onUpdate', 'worldmap', this.worldmap);
            ee.emit('onUpdate', 'cityPositioner', this.cityPositioner);
        });

        this.worldmapMenu.onConstructMode((enabled) => {
            enabled ? this.cityPositioner.enable(): this.cityPositioner.disable();
            ee.emit('onUpdate', 'cityPositioner', this.cityPositioner);
        });
    }

    newCity(x, y, z, level, name) {
        const params = {level: level, x: x, y: y, z: z, name: name, type: 'mesopotamia', leader:stateManager.playerId };
        this.worldmap.addCity(params);
        stateManager.newCity(params);
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

    mouseMoveOnMap(x, z) {
        if( this.cityPositioner.enabled) {
            this.cityPositioner.moveCity(x, z);
            ee.emit('onUpdate', 'cityPositioner', this.cityPositioner);
        }
    }

    mouseClick(x, z, model) {
        if(this.cityPositioner.enabled && this.cityPositioner.buildable) {
            const y = this.worldmap.getHeightTile(x, z);
            this.newCity(x, y, z, 1, 'myCity');

            this.worldmapMenu.switchConstrucMode();
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
