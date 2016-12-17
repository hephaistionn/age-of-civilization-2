const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const Positioner = require('../../Engine/Positioner');

const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const FirstStartPanel = require('../../UI/FirstStartPanel');
const LeaderCreationPanel = require('../../UI/LeaderCreationPanel');

let moveDx = 0;
let moveDz = 0;

class ScreenWorldmap {

    constructor(model, mapProperties) {

        this.camera = new Camera({
            x: model.camera.x,
            y: 40,
            z: model.camera.z,
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
            offsetZ: -10
        });
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);

        this.worldmapMenu = new WorldmapMenu();
        this.entityManagerPanel = new EntityManagerPanel();

        this.positioner = new Positioner(mapProperties);

        this.worldmap = new Worldmap(mapProperties);
        model.cities.map(cityId => {
            const city = stateManager.getCity(cityId);
            this.worldmap.addCity(city);
        });

        this.worldmapMenu.onConstructMode(() => {
            this.positioner.selectEnity('EntityCity');
        });

        if(!stateManager.getCurrentLeader()) {
            this.firstStartPanel = new FirstStartPanel();
            this.firstStartPanel.onClose(()=> {
                delete this.firstStartPanel;
                this.leaderCreationPanel = new LeaderCreationPanel();
                this.leaderCreationPanel.onClose(params => {
                    stateManager.newLeader(params);
                    //clean map => new worldmap;
                    delete this.leaderCreationPanel;
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
    }

    update(dt) {
        if(this.worldmap) {
            this.worldmap.update(dt);
        }

        if(moveDx !== 0 || moveDz !== 0) {
            this.camera.moveTo(moveDx, moveDz, dt);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        }
    }

    mouseMovePress(x, z) {
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    mouseUp() {
        this.camera.cleatMove();
    }

    mouseLeave(dx, dy) {
        if(this.entityManagerPanel.opened) return;
        moveDx = dx;
        moveDz = dy;
    }

    mouseEnter() {
        moveDx = 0;
        moveDz = 0;
    }

    mouseMoveOnMap(x, z) {
        if(this.positioner.selected) {
            this.positioner.moveEntity(x, z, 0, this.worldmap);
        }
    }

    mouseDownRight() {
        if(this.positioner.selected) {
            this.positioner.unselectEnity();
            this.worldmapMenu.stopConstructMode();
        }
    }

    mouseClick(x, z, model) {
        if(this.positioner.selected && !this.positioner.undroppable) {
            const entity = this.positioner.selected;
            this.newCity(entity.x, entity.y, entity.z, 1, 'myCity', stateManager.getCurrentLeader().id);
            this.positioner.unselectEnity();
            this.worldmapMenu.stopConstructMode();
        } else if(model) {
            this.entityManagerPanel.open(model);
        }
    }

    mouseWheel(delta) {
        this.camera.mouseWheel(delta);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
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
