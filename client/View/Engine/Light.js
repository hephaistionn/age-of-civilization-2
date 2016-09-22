const THREE = require('../../services/threejs');
const config = require('./config');

module.exports = class Light {

    constructor(model) {

        this.element = new THREE.Object3D();

        this.ambient = new THREE.AmbientLight(model.ambientColor);

        this.directionalLight = new THREE.DirectionalLight(model.directionalColor);
        this.directionalLight.matrixAutoUpdate = false;
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow = new THREE.LightShadow(new THREE.OrthographicCamera(-100, 100, 100, -100, 10, 1000));
        this.directionalLight.shadow.bias = 0.1;
        this.directionalLight.shadow.mapSize.width = 512;
        this.directionalLight.shadow.mapSize.height = 512;

        this.element.add(this.ambient);
        this.element.add(this.directionalLight);

        this.tileSize = config.tileSize;

        this.updateState(model);
    }

    updateState(model) {

        this.directionalLight.shadow.camera.zoom = 60 / (model.y * this.tileSize);
        this.directionalLight.shadow.camera.updateProjectionMatrix();

        this.directionalLight.matrix.elements[12] = model.x * this.tileSize;
        this.directionalLight.matrix.elements[13] = model.y * this.tileSize;
        this.directionalLight.matrix.elements[14] = model.z * this.tileSize;
        this.directionalLight.target.matrixWorld.elements[12] = model.targetX * this.tileSize;
        this.directionalLight.target.matrixWorld.elements[13] = model.targetY * this.tileSize;
        this.directionalLight.target.matrixWorld.elements[14] = model.targetZ * this.tileSize;
    }

    update(dt) {

    }

    remove() {

    }

};
