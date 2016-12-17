const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

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

let removeMode = false;
let rotation = 0;
let moveDx = 0;
let moveDz = 0;

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
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            removeMode = false;
            rotation = 0;

            if(entityId === 'Destroy') {
                removeMode = true;
            } else if(entityId === 'Road') {
                this.roadPositioner.selectEnity(2);
            } else {
                this.positioner.selectEnity(entityId);
            }
        });

    }

    update(dt) {
        if(this.map) {
            this.map.update(dt);
        }

        if(moveDx !== 0 || moveDz !== 0) {
            this.camera.moveTo(moveDx, moveDz, dt);
            this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        }
    }

    dismount() {

    }

    mouseMoveOnMap(x, z) {
        if(this.positioner.selected) {
            this.positioner.moveEntity(x, z, rotation, this.map);
        } else if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.moveEntity(x, z, this.map);
        }
    }

    mouseRotate() {
        rotation += Math.PI / 2;
        if(rotation >= Math.PI * 2) rotation = 0;
        var x = this.positioner.x;
        var z = this.positioner.z;
        this.positioner.moveEntity(x, z, rotation, this.map);
    }

    mouseMoveOnMapPress(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.rolloutSelectedEntity(x, z, this.map);
        }
    }

    mouseMovePress(x, z) {
        if(this.roadPositioner.selected) return;
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    mouseDown(x, z) {
        if(this.roadPositioner.selected)return;
        if(removeMode)return;
    }

    mouseDownRight() {
        if(this.roadPositioner.selected) {
            this.roadPositioner.unselectEnity();
        }
        if(this.positioner.selected) {
            this.positioner.unselectEnity();
        }

        this.buildingMenu.collapse();
        removeMode = false;
    }

    mouseDownOnMap(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.mouseDown(x, z);
        }
    }

    mouseClick(x, z, model) {
        if(removeMode) {
            if(model) {
                this.map.clearTile(x, z, model);
            }else{
                this.map.updateEntity('EntityRoad',null, {tiles:[Math.floor(x),Math.floor(z)],walkable:[1],length:1});
            }
        } else if(this.positioner.selected && !this.positioner.undroppable) {
            const entity = this.positioner.selected;
            const built = entity.constructor.construction();
            if(!built) return; //not enough resources
            const params = {entityId: entity.constructor.name, x: entity.x, y: entity.y, z: entity.z, a: entity.a};
            entity.onConstruct();
            this.map.newEntity(params);
            this.positioner.unselectEnity();
            this.buildingMenu.updateCurrentCategory();
        } else if(this.roadPositioner.selected) {
            this.roadPositioner.moveEntity(x, z, this.map);
            const params = this.roadPositioner.getNewRoad();
            if(params) {
                const built = Road.construction(params);
                if(!built) return; //not enough resource
                if(this.map.entityGroups['EntityRoad'].length===0){
                    this.map.newEntity({entityId: 'EntityRoad'});
                }
            }
        } else if(model) {
            this.entityManagerPanel.open(model);
        }
    }

    mouseUp() {
        this.camera.cleatMove();
        if(!this.roadPositioner.selected) return;
        const params = this.roadPositioner.getNewRoad();
        if(params) {
            const built = Road.construction(params);
            if(!built) return; //not enough resources
            if(this.map.entityGroups['EntityRoad'].length===0){
                this.map.newEntity({entityId: 'EntityRoad'});
            }
            this.map.updateEntity('EntityRoad', null, params);
        }
    }

    mouseLeave(dx, dy){
        if(this.monitoringPanel.opened || this.entityManagerPanel.opened) return;
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
    }

    newEntity(params) {
        params.map = this.map;
        params.map = this.map;
        this.map.newEntity(params);
    }

    removeEntity(entity) {
        this.map.removeEntity(entity);
    }

    syncState(model) {
        model.camera.x = this.camera.x;
        model.camera.z = this.camera.z;
        this.map.syncState(model.map);
    }

}

module.exports = ScreenMap;
