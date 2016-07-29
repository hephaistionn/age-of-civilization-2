const THREE = require('../../services/threejs');
const ENTITIES = require('./Entity/list');

module.exports = class Positioner {

    constructor(model) {
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.selected = null;
        this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    }

    updateState(model) {
        if(!model.selected) {
            if(!this.selected) return;
            this.element.remove(this.selected.element);
            this.selected = null;
        } else if(!this.selected || model.selected.constructor.name !== this.selected.constructor.name) {
            if(this.selected) {
                this.element.remove(this.selected.element);
            }
            this.selected = new ENTITIES[model.selected.constructor.name](model.selected, model.tileSize, model.tileMaxHeight);
            this.selected.element.material = this.material;
            this.element.add(this.selected.element);
        } else {
            this.material.color.setHex(model.undroppable ? 0xff0000 : 0x0000ff);
            this.selected.updateState(model.selected, model.tileSize, model.tileMaxHeight);
        }
    }

    update(dt) {

    }

    remove() {

    }
};
