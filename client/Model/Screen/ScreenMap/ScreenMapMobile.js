const ee = require('../../../services/eventEmitter');

const BuildingMenu = require('../../UI/BuildingMenu');
const MonitoringPanel = require('../../UI/MonitoringPanel');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');

const Map = require('../../Engine/Map');
const Light = require('../../Engine/Light');
const Camera = require('../../Engine/Camera');
const Positioner = require('../../Engine/Positioner');
const RoadPositioner = require('../../Engine/RoadPositioner');
const Road = require('../../Engine/Entity/Road/EntityRoad');
const Entity = require('../../Engine/Entity/Entity');

const PixelMap = require('../../../services/PixelMap');
let removeMode = false;
let selected = false;

class ScreenMap {

    constructor(model, mapProperties) {

        this.camera = new Camera({x: model.camera.x, z: model.camera.z});
        this.camera.setMapBorder(mapProperties);

        this.light = new Light({shadow: true});
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        this.light.scaleOffset(-this.camera.offsetY);

        this.buildingMenu = new BuildingMenu();
        this.monitoringPanel = new MonitoringPanel();
        this.entityManagerPanel = new EntityManagerPanel();

        this.map = new Map(mapProperties, model.map);

        this.positioner = new Positioner(mapProperties);

        this.roadPositioner = new RoadPositioner(mapProperties);

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
                const built = entity.constructor.construction();
                if(!built) return; //not enough resources
                this.positioner.unselectEnity();
                entity.onConstruct();
                this.map.newEntity(params);
                this.buildingMenu.hideEditor();
                ee.emit('onUpdate', 'map', this.map);
                ee.emit('onUpdate', 'positioner', this.positioner);
                ee.emit('onUpdate', 'monitoringPanel', this.monitoringPanel);
                ee.emit('onUpdate', 'buildingMenu', this.buildingMenu);
            }
        });

        this.buildingMenu.onCancelEditor(() => {
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            this.buildingMenu.hideEditor();
            ee.emit('onUpdate', 'positioner', this.positioner);
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
        if(removeMode) {
            this.map.clearTile(x, z, model);
            ee.emit('onUpdate', 'map', this.map);
        }else if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.mouseDown(x, z);
        } else if (model){
            this.entityManagerPanel.open(model);
        }
    }


    touchEnd(x, z) {
        this.camera.cleatMove();
        if(!this.roadPositioner.selected) return;
        const params = this.roadPositioner.getNewRoad();
        if(params) {
            const built = Road.construction(params);
            if(!built) return; //not enough resources
            this.map.updateEntity('EntityRoad', null, params);
            ee.emit('onUpdate', 'map', this.map);
            ee.emit('onUpdate', 'roadPositioner', this.roadPositioner);
            ee.emit('onUpdate', 'monitoringPanel', this.monitoringPanel);
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

    syncState(model) {
        model.camera.x = this.camera.x;
        model.camera.z = this.camera.z;
        this.map.syncState(model.map);
    }

}

module.exports = ScreenMap;
