const THREE = require('../../services/threejs');


module.exports = class Scene {

    constructor(canvas) {
        this.canvas = canvas;
        this.camera = null;

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setClearColor(0x54b2e5);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.scene = new THREE.Scene();
        this.scene.matrixAutoUpdate = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.cullFace = THREE.CullFaceBack;
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.renderer.setSize(width, height);
    }

    addChild(component) {
        if(component.element) {
            this.scene.add(component.element);
        } else {
            this.scene.add(component);
        }
        if(component.constructor.name === 'Camera') {
            this.camera = component.element;
            this.scene.camera = component.element;
        }
    }

    removeChild(component) {
        this.scene.remove(component.element);
        if(component.constructor.name === 'Camera') {
            this.camera = null;
        }
    }

    dismount() {
        this.canvas.removeEventListener('resize', this._resize);
    }
};
