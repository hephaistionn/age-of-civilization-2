const ee = require('../../../services/eventEmitter');

const Camera = require('../../Engine/Camera');

class ScreenWorldmap {

    constructor() {

        const camera = new Camera({});

        /**buttonA.onClick(function() {
            ee.emit('screen', 'ScreenB')
        }.bind(this));*/
        this.camera = camera;
    }

    update(dt) {

    }

    dismount() {
        this.camera = null;
    }
}

module.exports = ScreenWorldmap;
