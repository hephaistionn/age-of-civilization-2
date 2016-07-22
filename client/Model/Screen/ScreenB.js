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

        const panel = new Panel({width: 350, height: 100, x: 800, y: 30});
        const text = new Text({text: 'Screen B', size: 3});
        const button = new Button({text: 'Change Screen'});

        panel.setChild(text);
        panel.setChild(button);

        button.onClick(function() {
            ee.emit('screen', 'ScreenA');
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
        this.light.incOffset(delta * 2);
        this.light.moveTargetTo(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        ee.emit('onUpdate', 'camera', this.camera);
        ee.emit('onUpdate', 'light', this.light);
    }

}

module.exports = ScreenB;
