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
    EditorPanel: require('../UI/EditorPanel'),
    MonitoringPanel: require('../UI/MonitoringPanel'),
    WorldmapMenu: require('../UI/WorldmapMenu'),
    EntityManagerPanel: require('../UI/EntityManagerPanel'),
    FirstStartPanel: require('../UI/FirstStartPanel'),
    LeaderCreationPanel: require('../UI/LeaderCreationPanel')
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
        this.events = {};
        this.components = {};
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
                this.dom.removeChild(this.components[id].node)
            }
        }
    }

    show(models) {
        const map = this.components.map || this.components.worldmap;
        if(map) {
            map.refreshTexture();
        }

        let model;
        for(let id in models) {
            model = models[id];
            if(model.type === 'UI') {
                this.dom.appendChild(this.components[id].node);
            }
        }
        this.initObservers();
    }

    newComponent(id, model) {
        this.components[id] = new COMPONENTS[model.constructor.name](model);

        if(model.type === 'UI') {
            this.dom.appendChild(this.components[id].node);
        } else {
            this.render.addChild(this.components[id]);
        }
    }

    removeComponent(id) {
        if(this.components[id].type === 'UI') {
            if(this.components[id].node.parentNode) {
                this.dom.removeChild(this.components[id].node)
            }
        } else {
            this.components[id].remove();
            this.render.removeChild(this.components[id])
        }
        delete this.components[id];
    }

    update(dt, models) {

        const views = this.components;

        for(let id in views) {
            if(models[id] === undefined) {
                this.removeComponent(id);
            }
        }

        for(let id in models) {
            if(views[id]) {
                if(models[id].updated === true){
                    views[id].updateState(models[id]);
                    models[id].updated = false;
                }
                views[id].update(dt);
            } else {
                this.newComponent(id, models[id]);
            }
        }
        this.render.update();
    }

    getPointOnMap(screenX, screenY, recursive) {
        var components = this.components;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, components.camera.element);
        let intersects;
        let tileSize;
        if(components.map) {
            intersects = this.raycaster.intersectObjects(components.map.chunksList, recursive);
            tileSize = components.map.tileSize;
        } else {
            intersects = this.raycaster.intersectObjects(components.worldmap.touchSurface, recursive);
            tileSize = components.worldmap.tileSize;
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

    getPointOnMapCameraRelative(screenX, screenY, recursive) {
        var components = this.components;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        const camera = components.camera.element;
        this.raycaster.setFromCamera(this.mouse, components.camera.element);
        let intersects;
        let tileSize;
        if(components.map) {
            intersects = this.raycaster.intersectObjects(components.map.chunksList, recursive);
            tileSize = components.map.tileSize;
        } else {
            intersects = this.raycaster.intersectObjects(components.worldmap.touchSurface, recursive);
            tileSize = components.worldmap.tileSize;
        }
        if(intersects.length) {
            const point = intersects[0].point;
            point.x /= tileSize;
            point.z /= tileSize;
            point.x -= camera.matrixWorld.elements[12] / components.camera.tileSize;
            point.z -= camera.matrixWorld.elements[14] / components.camera.tileSize;
            return point;
        }
    }

    touchSelected(screenX, screenY) {
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.components.camera.element);
        const intersects = this.raycaster.intersectObjects([this.components.positioner.element], true);
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

