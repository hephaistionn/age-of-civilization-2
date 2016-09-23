const ee = require('../../../services/eventEmitter');

const BuildingMenu = require('../../UI/BuildingMenu');

const Map = require('../../Engine/Map');
const Light = require('../../Engine/Light');
const Camera = require('../../Engine/Camera');
const Positioner = require('../../Engine/Positioner');
const RoadPositioner = require('../../Engine/RoadPositioner');
const MonitoringPanel = require('../../UI/MonitoringPanel');

var PixelMap = require('../../../services/PixelMap');
let removeMode = false;
let selected = false;

class ScreenMap {

    constructor() {

        this.camera = new Camera({x: 25, z: 25});
        this.light = new Light({});
        this.buildingMenu = new BuildingMenu();

        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        this.light.scaleOffset(-this.camera.offsetY);

        this.buildingMenu.onClickBuilding(entityId => {
            if(entityId === 'Destroy') {
                this.buildingMenu.showDeletionEditor();
                this.positioner.unselectEnity();
                this.roadPositioner.unselectEnity();
                removeMode = true;
            } else if(entityId === 'Road') {
                this.positioner.unselectEnity();
                this.roadPositioner.selectEnity(2);
                this.buildingMenu.showRoadEditor();
                removeMode = false;
            } else {
                this.roadPositioner.unselectEnity();
                this.positioner.selectEnity(entityId);
                this.positioner.placeSelectedEntity(this.camera.targetX, this.camera.targetZ, this.map);
                this.buildingMenu.showEntityEditor();
                removeMode = false;
            }
            this.buildingMenu.close();
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
            ee.emit('onUpdate', 'positioner', this.positioner);

        });

        this.buildingMenu.onConstructEditor(() => {
            if(this.positioner.selected && !this.positioner.undroppable) {
                const entity = this.positioner.selected;
                const params = {entityId: entity.constructor.name, x: entity.x, y: entity.y, z: entity.z, a: entity.a};
                this.positioner.unselectEnity();
                this.map.newEntity(params);
                this.map.updateEntity('EntityRoad', null); //remove road under entity
                this.buildingMenu.hideEditor();
                ee.emit('onUpdate', 'map', this.map);
                ee.emit('onUpdate', 'positioner', this.positioner);
            }
        });

        this.buildingMenu.onCancelEditor(() => {
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            this.buildingMenu.hideEditor();
            ee.emit('onUpdate', 'positioner', this.positioner);
        });

        const pixelMap = new PixelMap();
        pixelMap.compute('map/map.png', (dataMap)=> {
            this.map = new Map(dataMap);
            this.positioner = new Positioner(dataMap);
            this.roadPositioner = new RoadPositioner(dataMap);
            this.camera.setMapBorder(dataMap);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
            ee.emit('onUpdate', 'map', this.map);
            ee.emit('onUpdate', 'positioner', this.positioner);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
            ee.emit('onUpdate', 'light', this.light);
        });

    }

    update(dt) {
        if(this.map) {
            this.map.update(dt);
        }
    }

    dismount() {

    }

    touchMove(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) return;
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    touchMoveOnMap(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.rolloutSelectedEntity(x, z, this.map);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
        }
    }

    touchDragg(x, z, screenX, screenY) {
        if(this.positioner.selected) {
            this.positioner.placeSelectedEntity(x, z, this.map);
            ee.emit('onUpdate', 'positioner', this.positioner);
        }
    }

    touchStart(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) return;
    }

    touchStartOnMap(x, z, model) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.mouseDown(x, z);
        }
        if(removeMode) {
            this.map.clearTile(x, z, model);
            ee.emit('onUpdate', 'map', this.map);
        }
    }


    touchEnd(x, z) {
        this.camera.cleatMove();
        if(!this.roadPositioner.selected) return;
        const params = this.roadPositioner.getNewRoad();
        if(params) {
            this.map.updateEntity('EntityRoad', null, params);
            ee.emit('onUpdate', 'map', this.map);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
        }
    }

    zoom(delta) {
        this.camera.scale(delta);
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

module.exports = ScreenMap;
