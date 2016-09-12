const THREE = require('../../services/threejs');
const material = require('./Material/materialRoadSelected');
const config = require('./config');

module.exports = class RoadPositioner {

    constructor(model) {

        this.MAX_TILES = 30;
        this.VERTEX_BY_TILE = 6;
        this.MAX_VERTEX = this.VERTEX_BY_TILE * this.MAX_TILES;
        this.pointsHeights = model.pointsHeights;
        this.tileSize = config.tileSize;
        this.tileHeight = config.tileHeight;
        this.nbPointX = model.nbPointX;
        this.nbPointZ = model.nbPointZ;
        this.material = material;
        this.model = model;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.MAX_VERTEX * 3);
        const walkable = new Float32Array(this.MAX_VERTEX * 1);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('walkable', new THREE.BufferAttribute(walkable, 1));
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
        const walkable = this.model.road.walkable;
        const l = this.model.road.length;
        const nbPointX = this.nbPointX;
        const pointsHeights = this.pointsHeights;
        const tileHeight = this.tileHeight;
        const geometry = this.element.geometry;
        const positions = geometry.attributes.position.array;
        const walkables = geometry.attributes.walkable.array;

        let x, z, i, vx, vz = 0;
        let ctn = 0;
        let ctnColor = 0, color;
        let absoluteIndex;

        geometry.drawRange.count = 1; //avoid WARNING: Render count or primcount is 0.

        for(i = 0; i < l; i++) {
            x = tiles[i * 2];
            z = tiles[i * 2 + 1];
            color = walkable[i];

            vx = x;
            vz = z + 1;
            absoluteIndex = vz * nbPointX + vx;
            walkables[ctnColor++] = color;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileHeight + 0.1;
            positions[ctn++] = vz * tileSize;

            vx = x + 1;
            vz = z;
            absoluteIndex = vz * nbPointX + vx;
            walkables[ctnColor++] = color;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileHeight + 0.1;
            positions[ctn++] = vz * tileSize;

            vx = x;
            vz = z;
            absoluteIndex = vz * nbPointX + vx;
            walkables[ctnColor++] = color;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileHeight + 0.1;
            positions[ctn++] = vz * tileSize;


            vx = x + 1;
            vz = z + 1;
            absoluteIndex = vz * nbPointX + vx;
            walkables[ctnColor++] = color;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileHeight + 0.1;
            positions[ctn++] = vz * tileSize;

            vx = x + 1;
            vz = z;
            absoluteIndex = vz * nbPointX + vx;
            walkables[ctnColor++] = color;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileHeight + 0.1;
            positions[ctn++] = vz * tileSize;

            vx = x;
            vz = z + 1;
            absoluteIndex = vz * nbPointX + vx;
            walkables[ctnColor++] = color;
            positions[ctn++] = vx * tileSize;
            positions[ctn++] = pointsHeights[absoluteIndex] / 255 * tileHeight + 0.1;
            positions[ctn++] = vz * tileSize;

            geometry.drawRange.count = ctn / 3;
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.walkable.needsUpdate = true;

        }
    }

    update(dt) {

    }

    remove() {

    }
};
