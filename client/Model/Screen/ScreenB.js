const ee = require('../../services/eventEmitter');

const BuildingMenu = require('../UI/BuildingMenu');

const Map = require('../Engine/Map');
const Light = require('../Engine/Light');
const Camera = require('../Engine/Camera');
const Positioner = require('../Engine/Positioner');
const RoadPositioner = require('../Engine/RoadPositioner');

var PixelMap = require('../../services/PixelMap');
let removeMode = false;

class ScreenB {

    constructor() {

        this.camera = new Camera({x: 100, z: 100});
        this.light = new Light({x: -35, y: 100, z: 25});
        this.buildingMenu = new BuildingMenu();

        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        this.light.scaleOffset(-this.camera.offsetY);

        this.buildingMenu.onClickBuilding(entityId => {
            if(entityId === 'Destroy') {
                this.positioner.unselectEnity();
                this.roadPositioner.unselectEnity();
                removeMode = true;
            } else if(entityId === 'Road') {
                this.positioner.unselectEnity();
                this.roadPositioner.selectEnity(2);
                removeMode = false;

            } else {
                this.roadPositioner.unselectEnity();
                this.positioner.selectEnity(entityId);
                removeMode = false;
            }
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
            ee.emit('onUpdate', 'positioner', this.positioner);

        });

        this.buildingMenu.onClose(()=> {
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            removeMode = false;
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
            ee.emit('onUpdate', 'positioner', this.positioner);
        });

        const pixelMap = new PixelMap();
        pixelMap.compute('map/map.png', (dataMap)=> {
            this.map = new Map(dataMap);
            this.positioner = new Positioner(dataMap);
            this.roadPositioner = new RoadPositioner(dataMap);
            ee.emit('onUpdate', 'map', this.map);
            ee.emit('onUpdate', 'positioner', this.positioner);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
        });

    }

    update(dt) {
        if(this.map) {
            this.map.update(dt);
        }
    }

    dismount() {

    }

    mouseMoveOnMap(x, z) {
        if(this.positioner && this.positioner.selected) {
            this.positioner.placeSelectedEntity(x, z, this.map);
            ee.emit('onUpdate', 'positioner', this.positioner);
        } else if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.placeSelectedEntity(x, z, this.map);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
        }
    }

    mouseMoveOnMapPress(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.rolloutSelectedEntity(x, z, this.map);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
        }
    }

    mouseMovePress(x, z) {
        if(this.roadPositioner.selected) return;
        this.camera.mouseMovePress(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    mouseDown(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) return;
        this.camera.mouseDown(x, z);
        ee.emit('onUpdate', 'camera', this.camera);
    }

    mouseDownOnMap(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.mouseDown(x, z);
        }
    }

    mouseClick(x, z, model) {
        if(removeMode) {
            this.map.clearTile(x, z, model);
            ee.emit('onUpdate', 'map', this.map);
        } else if(this.positioner.selected && !this.positioner.undroppable) {
            const entity = this.positioner.selected;
            const params = {entityId: entity.constructor.name, x: entity.x, y: entity.y, z: entity.z, a: entity.a};
            this.map.newEntity(params);
            ee.emit('onUpdate', 'map', this.map);
            this.map.updateEntity('EntityRoad', null); //remove road under entity
            ee.emit('onUpdate', 'map', this.map);
        } else if(this.roadPositioner.selected) {
            this.roadPositioner.placeSelectedEntity(x, z, this.map);
            const params = this.roadPositioner.getNewRoad();
            if(params) {
                this.map.updateEntity('EntityRoad', null, params);
                ee.emit('onUpdate', 'map', this.map);
                ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
            }
        }
    }

    mouseUp() {
        const params = this.roadPositioner.getNewRoad();
        if(params) {
            this.map.updateEntity('EntityRoad', null, params);
            ee.emit('onUpdate', 'map', this.map);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
        }
    }

    mouseWheel(delta) {
        this.camera.mouseWheel(delta * 2);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    newEntity(params) {
        params.map = this.map;
        this.map.newEntity(params);
        ee.emit('onUpdate', 'map', this.map);
    }

    removeEntity(entity) {
        this.map.removeEntity(entity);
        ee.emit('onUpdate', 'map', this.map);
    }

}

module.exports = ScreenB;
