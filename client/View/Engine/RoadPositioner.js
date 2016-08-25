const THREE = require('../../services/threejs');
const ENTITIES = require('./Entity/list');
const config = require('./config');

module.exports = class RoadPositioner {

    constructor(model) {

        this.MAX_TILES = 25;
        this.VERTEX_BY_TILE = 6;
        this.MAX_VERTEX = this.VERTEX_BY_TILE * this.MAX_TILES;
        this.pointsHeights = model.pointsHeights;
        this.tileSize = config.tileSize;
        this.tileMaxHeight = config.tileMaxHeight;
        this.nbPointX = model.nbPointX;
        this.nbPointZ = model.nbPointZ;
        this.material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        this.model = model;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.MAX_VERTEX * 3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setDrawRange(0, 3);
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;
        mesh.matrixWorldNeedsUpdate = false;
        mesh.receiveShadow = false;
        mesh.drawMode = THREE.TrianglesDrawMode;
        this.element = mesh;
    }

    updateState() {
        const tileSize = this.tileSize;

        const tiles = this.model.road.tiles;
        const l = tiles.length;
        const nbPointX = this.nbPointX;
        const pointsHeights = this.pointsHeights;
        const tileMaxHeight = this.tileMaxHeight;
        const geometry = this.element.geometry;
        const positions = geometry.attributes.position.array;

        let x, z, i, vx, vz = 0;
        let ctn = 0;
        let absoluteIndex;

        geometry.drawRange.count = 1; //avoid WARNING: Render count or primcount is 0.

        for(i = 0; i < l; i++) {
            x = tiles[i * 2];
            z = tiles[i * 2 + 1];

            vx = x;
            vz = z + 1;
            absoluteIndex = vz * nbPointX + vx;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileMaxHeight + 0.1;
            positions[ctn++] = vz * tileSize;
            //uvs[ctnUV++] = uvref[6];
            //uvs[ctnUV++] = uvref[7];

            vx = x + 1;
            vz = z;
            absoluteIndex = vz * nbPointX + vx;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileMaxHeight + 0.1;
            positions[ctn++] = vz * tileSize;
            //uvs[ctnUV++] = uvref[2];
            //uvs[ctnUV++] = uvref[3];

            vx = x;
            vz = z;
            absoluteIndex = vz * nbPointX + vx;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileMaxHeight + 0.1;
            positions[ctn++] = vz * tileSize;
            //uvs[ctnUV++] = uvref[0];
            //uvs[ctnUV++] = uvref[1];

            vx = x + 1;
            vz = z + 1;
            absoluteIndex = vz * nbPointX + vx;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileMaxHeight + 0.1;
            positions[ctn++] = vz * tileSize;
            //uvs[ctnUV++] = uvref[4];
            //uvs[ctnUV++] = uvref[5];

            vx = x + 1;
            vz = z;
            absoluteIndex = vz * nbPointX + vx;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileMaxHeight + 0.1;
            positions[ctn++] = vz * tileSize;
            //uvs[ctnUV++] = uvref[2];
            //uvs[ctnUV++] = uvref[3];

            vx = x;
            vz = z + 1;
            absoluteIndex = vz * nbPointX + vx;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileMaxHeight + 0.1;
            positions[ctn++] = vz * tileSize;
            //uvs[ctnUV++] = uvref[6];
            //uvs[ctnUV++] = uvref[7];
            geometry.drawRange.count = ctn / 3;
            geometry.attributes.position.needsUpdate = true;

        }
    }

    update(dt) {

    }

    remove() {

    }
};
