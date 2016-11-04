const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const PixelMap = require('../../../services/PixelMap');

const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const FirstStartPanel = require('../../UI/FirstStartPanel');

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
            offsetZ: -10,
            ambient: 0x776666
        });

        this.worldmapMenu = new WorldmapMenu();
        this.entityManagerPanel = new EntityManagerPanel();
        if(stateManager.firstBoot) {
            this.firstStartPanel = new FirstStartPanel();
            this.firstStartPanel.onClose(()=> {
                delete this.firstStartPanel;
                ee.emit('onUpdate', 'firstStartPanel');
                this.leaderCreationPanel = new LeaderCreationPanel();
                ee.emit('onUpdate', 'leaderCreationPanel', this.leaderCreationPanel);
                this.leaderCreationPanel.onClose(params => {
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
    }

    touchMove(x, z) {
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    touchEnd() {
        this.camera.cleatMove();
    }

    touchStartOnMap(x, z, model) {

        if(model) {
            this.entityManagerPanel.open(model);
        }
    }

    zoom(delta) {
        this.camera.scale(delta);
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
