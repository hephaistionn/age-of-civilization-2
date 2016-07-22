const THREE = require('../../services/threejs');

module.exports = class Camera {

    constructor(model) {
        const canvas = document.getElementById('D3');

        this.element = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.target = new THREE.Vector3();

        this.updateState(model);

        this.element.lookAt(this.target);
    }

    update(dt) {

    }

    updateState(model) {
        this.element.position.x = model.x;
        this.element.position.y = model.y;
        this.element.position.z = model.z;
        this.target.x = model.targetX;
        this.target.y = model.targetY;
        this.target.z = model.targetZ;
    }

    resize(width, height) {
        this.element.aspect = width / height;
        this.element.updateProjectionMatrix();
    }

    remove() {

    }
};
