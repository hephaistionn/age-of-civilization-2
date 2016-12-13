const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const CityPositioner = require('../../Engine/CityPositioner');

const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const FirstStartPanel = require('../../UI/FirstStartPanel');
const LeaderCreationPanel = require('../../UI/LeaderCreationPanel');

class ScreenWorldmap {

    constructor(model, mapProperties) {

        this.camera = new Camera({
            x: 100, y: 40, z: 70,
            offsetX: 0.0001,
            offsetY: -40,
            offsetZ: -30,
            zoomMax: 70,
            zoomMin: 20
        });
        this.camera.setMapBorder(mapProperties);
        this.light = new Light({
            offsetX: -10,
            offsetY: -40,
            offsetZ: -10,
            ambient: 0x776666
        });
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);

        this.worldmapMenu = new WorldmapMenu();
        this.entityManagerPanel = new EntityManagerPanel();
        this.cityPositioner = new CityPositioner(mapProperties);

        this.worldmap = new Worldmap(mapProperties);
        model.cities.map(cityId => {
            const city = stateManager.getCity(cityId);
            this.worldmap.addCity(city);
        });

        this.worldmapMenu.onConstructMode((enabled) => {
            enabled ? this.cityPositioner.enable() : this.cityPositioner.disable();
            this.cityPositioner.placeCity(this.camera.targetX, this.camera.targetZ, this.worldmap);
            ee.emit('onUpdate', 'cityPositioner', this.cityPositioner);
        });


        this.worldmapMenu.onConstructEditor(() => {
            if(this.cityPositioner.enabled && this.cityPositioner.buildable) {
                const y = this.worldmap.getHeightTile(x, z);
                this.newCity(x, y, z, 1, 'myCity', stateManager.getCurrentLeader().id);
                this.worldmapMenu.switchConstrucMode();
                ee.emit('onUpdate', 'worldmap', this.worldmap);
            }
        });


        if(!stateManager.getCurrentLeader()) {
            this.firstStartPanel = new FirstStartPanel();
            this.firstStartPanel.onClose(()=> {
                delete this.firstStartPanel;
                ee.emit('onUpdate', 'firstStartPanel');
                this.leaderCreationPanel = new LeaderCreationPanel();
                ee.emit('onUpdate', 'leaderCreationPanel', this.leaderCreationPanel);
                this.leaderCreationPanel.onClose(params => {
                    stateManager.newLeader(params);
                    //clean map => new worldmap;
                    delete this.leaderCreationPanel;
                    ee.emit('onUpdate', 'leaderCreationPanel');
                });
            });
        }
    }

    newCity(x, y, z, level, name, leaderId) {
        const params = stateManager.newCity({
            level: level, x: x, y: y, z: z, name: name,
            type: 'mesopotamia', leader: leaderId
        });
        this.worldmap.addCity(params);
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

    touchDragg(x, z, screenX, screenY) {
        if(this.cityPositioner.selected) {
            this.cityPositioner.moveEntity(x, z, this.worldmap);
            ee.emit('onUpdate', 'cityPositioner', this.cityPositioner);
        }
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

    syncState(model) {
        model.camera.x = this.camera.x;
        model.camera.z = this.camera.z;
    }

}

module.exports = ScreenWorldmap;
