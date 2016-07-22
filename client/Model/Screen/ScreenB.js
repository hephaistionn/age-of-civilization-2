const ee = require('../../services/eventEmitter');

const Panel = require('../UI/Panel');
const Text = require('../UI/Text');
const Button = require('../UI/Button');

const Map = require('../Engine/Map');
const Light = require('../Engine/Light');
const Camera = require('../Engine/Camera');

var PixelMap = require('../../services/PixelMap');

class ScreenB {

    constructor() {

        const camera = new Camera({x: 100, z: 100});
        const light = new Light({});
        light.moveTargetTo(camera.targetX, camera.targetY, camera.targetZ);
        light.scaleOffset(-camera.offsetY);

        const panel = new Panel({width: 200, height: 200, x: 0, y: 0});
        const text = new Text({text: 'Screen B', size: 3});
        const buttonScreen = new Button({text: 'Change Screen'});
        const buttonHouse = new Button({text: 'Build House'});

        panel.setChild(text);
        panel.setChild(buttonScreen);
        panel.setChild(buttonHouse);

        buttonScreen.onClick(function() {
            ee.emit('screen', 'ScreenA');
        }.bind(this));

        buttonHouse.onClick(function() {
            //new house
        }.bind(this));

        this.camera = camera;
        this.light = light;
        this.panel = panel;

        const pixelMap = new PixelMap();
        pixelMap.compute('map/map.png', (dataMap)=> {
            this.map = new Map(dataMap);
            ee.emit('onUpdate', 'map', this.map);
        });

    }

    update(dt) {
        //this.map.update(dt);
    }

    dismount() {

    }

    mouseMovePress(x, z) {
        this.camera.mouseMovePress(x, z);
        this.light.moveTargetTo(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

    mouseDown(x, z) {
        this.camera.mouseDown(x, z);
        ee.emit('onUpdate', 'camera', this.camera);
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
