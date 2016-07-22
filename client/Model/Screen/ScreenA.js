const ee = require('../../services/eventEmitter');

const Camera = require('../Engine/Camera');

const Panel = require('../UI/Panel');
const Text = require('../UI/Text');
const Button = require('../UI/Button');
const Picture = require('../UI/Picture');

class ScreenA {

    constructor() {

        const camera = new Camera({});

        const panel = new Panel({width: 500, height: 600});
        const textA = new Text({text: 'Screen A', size: 3});
        const buttonAdd = new Button({text: '++'});
        const buttonRemove = new Button({text: '--'});
        const picture = new Picture({src: 'svg/testA.svg', width: 20, height: 20});
        const buttonA = new Button({text: 'Change Screen'});
        const buttonC = new Button({text: 'button C'});

        panel.setChild(textA);
        panel.setChild(buttonAdd);
        panel.setChild(buttonRemove);
        panel.setChild(picture);
        panel.setChild(buttonA);
        panel.setChild(buttonC);

        buttonA.onClick(function() {
            ee.emit('screen', 'ScreenB')
        }.bind(this));

        buttonC.onClick(function() {
            textA.setText('Screen A ' + Math.random());
            textA.setClassName('updated');
            camera.moveTo(0, 0, 0);
            ee.emit('onUpdate', 'panel', panel);
        });

        let ctn = 0;
        const items = [];
        buttonRemove.onClick(function() {
            ctn--;
            if(ctn < 0)ctn = 0;
            panel.removeChild(items.pop());
            ee.emit('onUpdate', 'panel', panel);
        });

        buttonAdd.onClick(function() {
            ctn++;
            const item = new Text({text: 'item' + ctn});
            panel.setChild(item);
            items.push(item);
            ee.emit('onUpdate', 'panel', panel);
        });

        this.panel = panel;
        this.camera = camera;
    }

    update(dt) {

    }

    dismount() {
        this.panel = null;
        this.camera = null;
    }
}

module.exports = ScreenA;
