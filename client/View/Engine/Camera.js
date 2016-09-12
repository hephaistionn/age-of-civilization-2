const THREE = require('../../services/threejs');
const config = require('./config');

module.exports = class Camera {

    constructor(model) {
        const canvas = document.getElementById('D3');

        this.element = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.target = new THREE.Vector3();

        this.tileSize = config.tileSize;

        this.updateState(model);

        this.element.lookAt(this.target);
    }

    update(dt) {

    }

    updateState(model) {
        this.element.position.x = model.x * this.tileSize;
        this.element.position.y = model.y * this.tileSize;
        this.element.position.z = model.z * this.tileSize;
        this.target.x = model.targetX * this.tileSize;
        this.target.y = model.targetY * this.tileSize;
        this.target.z = model.targetZ * this.tileSize;
    }

    resize(width, height) {
        this.element.aspect = width / height;
        this.element.updateProjectionMatrix();
    }

    remove() {

    }
};
