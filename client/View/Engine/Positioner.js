const THREE = require('../../services/threejs');
const ENTITIES = require('./Entity/list');

module.exports = class Positioner {

    constructor(model) {
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.selected = null;
    }

    updateState(model) {
        if(!model.selected) {
            if(!this.selected) return;
            this.element.remove(this.selected.element);
            this.selected = null;
        } else if(!this.selected || model.selected.constructor.name !== this.selected.constructor.name) {
            this.selected = new ENTITIES[model.selected.constructor.name](model.selected, model.tileSize);
            this.element.add(this.selected.element);
        } else {
            this.selected.updateState(model.selected, model.tileSize);
        }
    }

    update(dt) {

    }

    remove() {

    }
};
