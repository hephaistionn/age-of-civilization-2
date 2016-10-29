const THREE = require('../../services/threejs');
const isMobile = require('../../services/mobileDetection')();

const COMPONENTS = {
    Map: require('../Engine/Map'),
    Light: require('../Engine/Light'),
    Camera: require('../Engine/Camera'),
    Render: require('../Engine/Render'),
    Positioner: require('./../Engine/Positioner'),
    RoadPositioner: require('./../Engine/RoadPositioner'),
    Worldmap: require('../Engine/Worldmap'),
    BuildingMenu: require('../UI/BuildingMenu'),
    MonitoringPanel: require('../UI/MonitoringPanel'),
    WorldmapMenu: require('../UI/WorldmapMenu')
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
        this.events = {}
    }

    mount(model) {
        for(let id in model) {
            this.newComponent(id, model[id]);
        }
        this.initObservers();
    }

    dismount(model) {
        this.removeObservers();
        for(let id in model) {
            this.removeComponent(id)
        }
    }

    hide(models) {
        let model;
        this.removeObservers();
        for(let id in models) {
            model = models[id];
            if(model.type === 'UI') {
                this.dom.removeChild(this[id].node)
            }
        }
    }

    show(models) {
        let model;
        for(let id in models) {
            model = models[id];
            if(model.type === 'UI') {
                this.dom.appendChild(this[id].node);
            }
        }
        this.initObservers();
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
            if(model !== undefined) {
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

    getPointOnMap(screenX, screenY) {
        if(!this.map && !this.worldmap)return;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        let intersects;
        let tileSize;
        if(this.map) {
            intersects = this.raycaster.intersectObjects(this.map.chunksList, true);
            tileSize = this.map.tileSize;
        } else {
            intersects = this.raycaster.intersectObjects(this.worldmap.touchSurface, true);
            tileSize = this.worldmap.tileSize;
        }
        if(intersects.length) {
            const point = intersects[0].point;
            point.x /= tileSize;
            point.z /= tileSize;
            const mesh = intersects[0].object;
            if(mesh.userData.model) {
                return {
                    model: mesh.userData.model,
                    x: point.x,
                    z: point.z
                }
            } else {
                return point;
            }

        } else {
            return;
        }
    }

    getPointOnMapCameraRelative(screenX, screenY) {
        if(!this.map && !this.worldmap)return;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        const camera = this.camera.element;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        let intersects;
        let tileSize;
        if(this.map) {
            intersects = this.raycaster.intersectObjects(this.map.chunksList, true);
            tileSize = this.map.tileSize;
        }
        else {
            intersects = this.raycaster.intersectObjects(this.worldmap.touchSurface, true);
            tileSize = this.worldmap.tileSize;
        }
        if(intersects.length) {
            const point = intersects[0].point;
            point.x /= tileSize;
            point.z /= tileSize;
            point.x -= camera.matrixWorld.elements[12] / this.camera.tileSize;
            point.z -= camera.matrixWorld.elements[14] / this.camera.tileSize;
            return point;
        }
    }

    touchSelected(screenX, screenY) {
        if(!this.map || !this.camera || !this.positioner.element)return false;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        const intersects = this.raycaster.intersectObjects([this.positioner.element], true);
        if(intersects.length) {
            return true;
        } else {
            return false
        }
    }
}

if(isMobile) {
    require('./eventsMobile.js')(Screen);
} else {
    require('./eventsPC.js')(Screen);
}

module.exports = Screen;

