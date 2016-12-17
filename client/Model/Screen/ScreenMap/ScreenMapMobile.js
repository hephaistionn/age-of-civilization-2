const ee = require('../../../services/eventEmitter');

const BuildingMenu = require('../../UI/BuildingMenu');
const MonitoringPanel = require('../../UI/MonitoringPanel');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const EditorPanel = require('../../UI/EditorPanel');

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
let rotation = 0;

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
        this.editorPanel = new EditorPanel();

        this.map = new Map(mapProperties, model.map);

        this.positioner = new Positioner(mapProperties);

        this.roadPositioner = new RoadPositioner(mapProperties);

        this.buildingMenu.onClickBuilding(entityId => {
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            this.editorPanel.open();
            removeMode = false;
            rotation = 0;

            if(entityId === 'Destroy') {
                this.editorPanel.showDeletionEditor();
                removeMode = true;
            } else if(entityId === 'Road') {
                this.roadPositioner.selectEnity(2);
                this.editorPanel.showRoadeEditor();
            } else {
                this.positioner.selectEnity(entityId);
                this.positioner.moveEntity(this.camera.targetX, this.camera.targetZ, rotation, this.map);
                this.editorPanel.showEntityEditor();
            }

            this.buildingMenu.close();
        });

        this.editorPanel.onConfirm(() => {
            if(this.positioner.selected && !this.positioner.undroppable) {
                const entity = this.positioner.selected;
                const params = {entityId: entity.constructor.name, x: entity.x, y: entity.y, z: entity.z, a: entity.a};
                const built = entity.constructor.construction();
                if(!built) return; //not enough resources
                this.positioner.unselectEnity();
                entity.onConstruct();
                this.map.newEntity(params);
            }
            this.buildingMenu.open();
        });

        this.editorPanel.onCancel(() => {
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            this.buildingMenu.open();
        });

        this.editorPanel.onRotate(() => {
            rotation += Math.PI / 2;
            if(rotation >= Math.PI * 2) rotation = 0;
            var x = this.positioner.x;
            var z = this.positioner.z;
            this.positioner.moveEntity(x, z, rotation, this.map);
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
    }

    touchMoveOnMap(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.rolloutSelectedEntity(x, z, this.map);
        }
    }

    touchDragg(x, z, screenX, screenY) {
        if(this.positioner.selected) {
            this.positioner.moveEntity(x, z, rotation, this.map);
        }
    }

    touchStart(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) return;
    }

    touchStartOnMap(x, z, model) {
        if(removeMode) {
            if(model) {
                this.map.clearTile(x, z, model);
            }else if(this.map.entityGroups['EntityRoad'].length!==0) {
                this.map.updateEntity('EntityRoad',null, {tiles:[Math.floor(x),Math.floor(z)],walkable:[1],length:1});
            }
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
            if(this.map.entityGroups['EntityRoad'].length===0){
                this.map.newEntity({entityId: 'EntityRoad'});
            }
            this.map.updateEntity('EntityRoad', null, params);
        }
    }

    zoom(delta) {
        this.camera.scale(delta);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    newEntity(params) {
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
