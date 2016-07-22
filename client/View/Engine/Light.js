const THREE = require('../../services/threejs');
const materialMap = require('./materialMap');

module.exports = class Light {

    constructor(model) {

        this.element = new THREE.Object3D();

        this.ambient = new THREE.AmbientLight(model.ambientColor);

        this.directionalLight = new THREE.DirectionalLight(model.directionalColor);
        this.directionalLight.matrixAutoUpdate = false;
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow = new THREE.LightShadow(new THREE.OrthographicCamera(-120, 90, 90, -120, 1, 500));
        this.directionalLight.shadow.bias = 0.00001;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;

        this.element.add(this.ambient);
        this.element.add(this.directionalLight);

        this.updateState(model);
    }

    updateState(model) {

        this.directionalLight.shadow.camera.zoom = 90 / model.y;
        this.directionalLight.shadow.camera.updateProjectionMatrix();

        this.directionalLight.matrix.elements[12] = model.x;
        this.directionalLight.matrix.elements[13] = model.y;
        this.directionalLight.matrix.elements[14] = model.z;
        this.directionalLight.target.matrixWorld.elements[12] = model.targetX;
        this.directionalLight.target.matrixWorld.elements[13] = model.targetY;
        this.directionalLight.target.matrixWorld.elements[14] = model.targetZ;
    }

    update(dt) {

    }

    remove() {

    }

};
