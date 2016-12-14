const THREE = require('../../services/threejs');
const ENTITIES = require('./Entity/listEntity');
const config = require('./config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;


module.exports = class Positioner {

    constructor(model) {
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.selected = null;
        this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        this.tileSize = config.tileSize;
        this.tileHeight = config.tileHeight;
        this.meshHelper = this.createHelper();
        this.previousA = 0; //used to check the  update rotation of selected entity;
    }

    updateState(model) {
        if(!model.selected) {
            if(!this.selected) return;
            this.element.remove(this.selected.element);
            this.element.remove(this.meshHelper);
            this.selected = null;
        } else if(!this.selected || model.selected.constructor.name !== this.selected.constructor.name) {
            if(this.selected) {
                this.element.remove(this.selected.element);
            }
            this.selected = new ENTITIES[model.selected.constructor.name](model.selected, this.material);
            this.previousA = null; //to force helper redrawing
            this.ajustHelper(model.selected);
            this.material.color.setHex(model.undroppable ? 0xff0000 : 0x0000ff);
            this.element.add(this.selected.element);
            this.element.add(this.meshHelper);
        } else {
            this.material.color.setHex(model.undroppable ? 0xff0000 : 0x0000ff);
            this.selected.updateState(model.selected);
            this.ajustHelper(model.selected);

        }
    }

    createHelper() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6 * 3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
        //const mesh = new THREE.Mesh(geometry, material);

        const material = new THREE.PointsMaterial({color: 0x00ff00, size: 2});
        const mesh = new THREE.Points(geometry, material);

        //const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
        //const mesh = new THREE.Line( geometry, material );

        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;
        mesh.matrixWorldNeedsUpdate = false;

        return mesh;
    }

    ajustHelper(modelEntity) {

        this.moveHelper(modelEntity);
        if(this.previousA != modelEntity.a) {
            this.previousA = modelEntity.a;
            this.redrawHepler(modelEntity);
        }
    }

    moveHelper(model) {
        const matrixWorld = this.meshHelper.matrixWorld.elements;
        matrixWorld[12] = model.x * tileSize;
        matrixWorld[14] = model.z * tileSize;
        matrixWorld[13] = model.y * tileHeight;
    }

    redrawHepler(modelEntity) {
        const positions = this.meshHelper.geometry.attributes.position.array;
        this.meshHelper.geometry.attributes.position.needsUpdate = true;
        const nx = modelEntity.constructor.tile_x;
        const nz = modelEntity.constructor.tile_z;
        let sizeX = nx * tileSize / 2;
        let sizeZ = nz * tileSize / 2;

        if(modelEntity.a !== 0 && modelEntity.a !== Math.PI) {
            sizeZ = nx * tileSize / 2;
            sizeX = nz * tileSize / 2;
        }

        positions[0] = -sizeX;
        positions[1] = 1;
        positions[2] = -sizeZ;

        positions[3] = sizeX;
        positions[4] = 1;
        positions[5] = -sizeZ;

        positions[6] = -sizeX;
        positions[7] = 1;
        positions[8] = sizeZ;

        positions[9] = -sizeX;
        positions[10] = 1;
        positions[11] = sizeZ;

        positions[12] = sizeX;
        positions[13] = 1;
        positions[14] = sizeZ;

        positions[15] = sizeX;
        positions[16] = 1;
        positions[17] = -sizeZ;
    }

    update(dt) {

    }

    remove() {

    }
};
