const ee = require('../../services/eventEmitter');

const Panel = require('../UI/Panel');
const Text = require('../UI/Text');
const Button = require('../UI/Button');

const Map = require('../Engine/Map');
const Light = require('../Engine/Light');
const Camera = require('../Engine/Camera');
const Positioner = require('../Engine/Positioner');


var PixelMap = require('../../services/PixelMap');

class ScreenB {

    constructor() {

        this.camera = new Camera({x: 100, z: 100});
        this.light = new Light({x: -35, y: 100, z: 25});
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        this.light.scaleOffset(-this.camera.offsetY);


        const text = new Text({text: 'Screen B', size: 3});
        const buttonScreen = new Button({text: 'Change Screen'});
        const buttonHouse = new Button({text: 'Build House'});
        const buttonChurch = new Button({text: 'Build Church'});
        const buttonRemove = new Button({text: 'Remove'});
        const buttonRotate = new Button({text: 'Rotate'});

        this.panel = new Panel({width: 200, height: 250, x: 0, y: 0});
        this.panel.setChild(text);
        this.panel.setChild(buttonScreen);
        this.panel.setChild(buttonHouse);
        this.panel.setChild(buttonChurch);
        this.panel.setChild(buttonRemove);
        this.panel.setChild(buttonRotate);

        buttonScreen.onClick(() => {
            ee.emit('screen', 'ScreenA');
        });

        buttonHouse.onClick(() => {
            this.positioner.selectEnity('EntityHouse');
            ee.emit('onUpdate', 'positioner', this.positioner);
        });

        buttonChurch.onClick(() => {
            this.positioner.selectEnity('EntityChurch');
            ee.emit('onUpdate', 'positioner', this.positioner);
        });

        buttonRemove.onClick(() => {
            this.positioner.removeEnable();
            ee.emit('onUpdate', 'positioner', this.positioner);
        });

        buttonRotate.onClick(() => {
            this.positioner.increaseRotation();
            ee.emit('onUpdate', 'positioner', this.positioner);
        });


        const pixelMap = new PixelMap();
        pixelMap.compute('map/map.png', (dataMap)=> {
            this.map = new Map(dataMap);
            this.positioner = new Positioner(dataMap);
            ee.emit('onUpdate', 'map', this.map);
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

    mouseMoveOnMap(x, z) {
        if(this.positioner.selected) {
            this.positioner.placeSelectedEntity(x, z, this.map);
            ee.emit('onUpdate', 'positioner', this.positioner);
        }
    }

    mouseMovePress(x, z) {
        this.camera.mouseMovePress(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    mouseTouchEntity(model) {
        if(this.positioner.removeMode) {
            this.map.removeEntity(model);
            ee.emit('onUpdate', 'map', this.map);
        } else {
            //select entity
        }

    }

    mouseDown(x, z) {
        this.camera.mouseDown(x, z);
        ee.emit('onUpdate', 'camera', this.camera);
    }

    mouseClick(x, z) {
        if(this.positioner.selected && !this.positioner.undroppable) {
            const entity = this.positioner.selected;
            const params = {entityId: entity.constructor.name, x: entity.x, y: entity.y, z: entity.z, a: entity.a};
            this.map.newEntity(params);
            ee.emit('onUpdate', 'map', this.map);
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
