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

        const camera = new Camera({x: 100, z: 100});
        const light = new Light({});
        light.moveTargetTo(camera.targetX, camera.targetY, camera.targetZ);
        light.scaleOffset(-camera.offsetY);

        const panel = new Panel({width: 200, height: 250, x: 0, y: 0});
        const text = new Text({text: 'Screen B', size: 3});
        const buttonScreen = new Button({text: 'Change Screen'});
        const buttonHouse = new Button({text: 'Build House'});
        const buttonChurch = new Button({text: 'Build Church'});
        const buttonRemove = new Button({text: 'Remove'});


        panel.setChild(text);
        panel.setChild(buttonScreen);
        panel.setChild(buttonHouse);
        panel.setChild(buttonChurch);
        panel.setChild(buttonRemove);

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

        this.camera = camera;
        this.light = light;
        this.panel = panel;

        const pixelMap = new PixelMap();
        pixelMap.compute('map/map.png', (dataMap)=> {
            dataMap.tileSize = 4;
            dataMap.maxHeight = 10;
            this.map = new Map(dataMap);
            ee.emit('onUpdate', 'map', this.map);
            this.positioner = new Positioner(dataMap);
            ee.emit('onUpdate', 'positioner', this.positioner);

        });

    }

    update(dt) {
        //this.map.update(dt);
    }

    dismount() {

    }


    mouseMoveOnMap(x, z) {

        if(this.positioner.selected) {
            this.positioner.placeSelectedEntity(x, z, 0, this.map);
            ee.emit('onUpdate', 'positioner', this.positioner);
        } else {
            this.positioner.setCurrentPosition(x, z);
        }
    }

    mouseMovePress(x, z) {
        this.camera.mouseMovePress(x, z);
        this.light.moveTargetTo(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    mouseTouchEntity(model) {
        if(this.positioner.removeMode) {
            console.log('must remove');
            this.map.removeEntity(model);
        } else {
            //select entity
        }
        ee.emit('onUpdate', 'map', this.map);
    }

    mouseDown(x, z) {

        this.camera.mouseDown(x, z);
        ee.emit('onUpdate', 'camera', this.camera);
    }

    mouseUp(x, z) {
        if(this.positioner.selected && !this.camera.hasMoved(x, z)) {
            this.map.newEntity(this.positioner.selected);
            ee.emit('onUpdate', 'map', this.map);
        }
    }

    mouseWheel(delta) {
        this.camera.mouseWheel(delta * 2);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTargetTo(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

}

module.exports = ScreenB;
