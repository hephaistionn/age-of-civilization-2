const THREE = require('../../services/threejs');
const isMobile = require('../../services/mobileDetection')();

const COMPONENTS = {
    Map: require('./../Engine/Map'),
    Light: require('./../Engine/Light'),
    Camera: require('./../Engine/Camera'),
    Render: require('./../Engine/Render'),
    Positioner: require('./../Engine/Positioner'),
    RoadPositioner: require('./../Engine/RoadPositioner'),
    BuildingMenu: require('../UI/BuildingMenu')
};

class Screen {

    constructor() {
        this.canvas = document.getElementById('D3');
        this.dom = document.getElementById('UI');
        this.container = document.getElementById('container');
        this.render = new COMPONENTS.Render(this.canvas);
        this.mousePress = false;
        this.mouse = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.pressX = 0;
        this.pressZ = 0;
        this.initObservers();
    }

    mount(model) {
        for(let id in model) {
            this.newComponent(id, model[id]);
        }
    }

    dismount(model) {
        for(let id in model) {
            this.removeComponent(id)
        }
    }

    newComponent(id, model) {
        this[id] = new COMPONENTS[model.constructor.name](model);

        if(model.type === 'UI') {
            this.dom.appendChild(this[id].node);
        } else {
            this.render.addChild(this[id]);
        }
    }

    removeComponent(id) {
        if(this[id].type === 'UI') {
            this.dom.removeChild(this[id].node)
        } else {
            this[id].remove();
            this.render.removeChild(this[id])
        }
        delete this[id];
    }

    updateComponent(id, model) {
        if(this[id]) {
            if(model) {
                this[id].updateState(model);
            } else {
                this.removeComponent(id);
            }
        } else {
            this.newComponent(id, model);
        }
    }

    update(dt, model) {
        for(let id in model) {
            this[id].update(dt);
        }
        this.render.update();
    }
}
;

if(isMobile) {
    require('./eventsMobile.js')(Screen);
} else {
    require('./eventsPC.js')(Screen);
}

module.exports = Screen;

