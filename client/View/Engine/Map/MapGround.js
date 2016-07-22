const THREE = require('../../../services/threejs');
const materialMap = require('./../materialMap');

module.exports = Map=> {

    Map.prototype.initGround = function initGround(model) {

        this.materialMap = materialMap;
        //this.materialMap = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe : true}
        //this.materialMap = new THREE.MeshPhongMaterial( { color: 0x555555 } );

        const nx = model.tile_nx;
        const nz = model.tile_nz;

        const chunksTiles = [0];
        for(let x = 0; x < nx; x++) {
            if(chunksTiles[chunksTiles.length - 1] === this.tileByChunk) {
                chunksTiles.push(1);
            } else {
                chunksTiles[chunksTiles.length - 1]++;
            }
        }

        const chunks = [];
        const length = chunksTiles.length;
        let x, z, offsetXTiles, offsetZTiles, nbXTiles, nbZTiles;
        //prepare chunk geo
        for(x = 0; x < length; x++) {
            chunks[x] = [];
            for(z = 0; z < length; z++) {
                nbXTiles = chunksTiles[x];
                nbZTiles = chunksTiles[z];
                offsetXTiles = x * this.tileByChunk;
                offsetZTiles = z * this.tileByChunk;
                let chunkGeo = this.createSurface(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, model);
                chunks[x][z] = chunkGeo;
            }
        }

        //smooth normals of chunks
        for(x = 0; x < length; x++) {
            for(z = 0; z < length; z++) {
                nbXTiles = chunksTiles[x];
                nbZTiles = chunksTiles[z];
                let chunkX1Z1 = chunks[x][z];
                let chunkX2Z1 = chunks[x + 1] ? chunks[x + 1][z] : undefined;
                let chunkX1Z2 = chunks[x][z + 1];
                this.smoothNormals(chunkX1Z1, chunkX2Z1, chunkX1Z2, nbXTiles, nbZTiles);
            }
        }

        this.chunks = [];
        for(x = 0; x < length; x++) {
            this.chunks[x] = [];
            for(z = 0; z < length; z++) {
                offsetXTiles = x * this.tileByChunk * this.tileSize;
                offsetZTiles = z * this.tileByChunk * this.tileSize;
                let xSize = chunksTiles[x] * this.tileSize;
                let zSize = chunksTiles[z] * this.tileSize;

                let chunkGeo = chunks[x][z];
                let chunkMesh = new THREE.Mesh(chunkGeo, this.materialMap);
                chunkMesh.rotation.x = -Math.PI / 2;

                chunkMesh.position.set(offsetXTiles + xSize / 2, 0, offsetZTiles + zSize / 2);

                this.element.add(chunkMesh);
                chunkMesh.updateMatrixWorld();
                chunkMesh.frustumCulled = false;
                chunkMesh.matrixAutoUpdate = false;
                chunkMesh.matrixWorldNeedsUpdate = false;
                chunkMesh.castShadow = true;
                chunkMesh.receiveShadow = true;

                this.chunks[x][z] = chunkMesh;
            }
        }

    };

    Map.prototype.createSurface = function createSurface(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, model) {
        const xSize = nbXTiles * this.tileSize;
        const zSize = nbZTiles * this.tileSize;

        const chunkGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, nbXTiles, nbZTiles);
        delete chunkGeometry.attributes.normal;
        delete chunkGeometry.attributes.uv;

        const position = chunkGeometry.attributes.position;
        const posArray = position.array;
        const length = position.count;
        const grounds = new Float32Array(length);

        const correctionX = nbXTiles / 2;
        const correctionZ = nbZTiles / 2;

        for(let i = 0; i < length; i++) {
            let tilex = offsetXTiles + posArray[i * 3] / this.tileSize + correctionX;
            let tiley = offsetZTiles + nbZTiles - (posArray[i * 3 + 1] / this.tileSize + correctionZ); //begin at top, not to 0
            let index = tiley * model.tile_nz + tilex;

            let tile_type = model.tile_type[index] || 0;
            let tile_height = model.tile_height[index] || 0;
            grounds[i] = tile_type / 255;
            posArray[i * 3 + 2] = tile_height / 255 * this.maxHeight;
        }

        chunkGeometry.addAttribute('grounds', new THREE.BufferAttribute(grounds, 1));
        chunkGeometry.computeVertexNormals();
        chunkGeometry.attributes.grounds.needsUpdate = true;
        chunkGeometry.attributes.position.needsUpdate = true;

        return chunkGeometry;
    };

    Map.prototype.smoothNormals = function smoothNormals(chunkX1Z1, chunkX2Z1, chunkX1Z2, nbXTiles, nbZTiles) {

        let normalX1Z1 = chunkX1Z1.attributes.normal.array;
        let normalX2Z1 = chunkX2Z1 ? chunkX2Z1.attributes.normal.array : [];
        let normalX1Z2 = chunkX1Z2 ? chunkX1Z2.attributes.normal.array : [];
        let x, z;
        //(3*(Nx+1))*z+3*x //index of common borders
        if(normalX1Z2.length) {
            for(x = 0; x < nbXTiles + 1; x++) {
                let indexX1Z1 = (3 * (nbXTiles + 1)) * (nbZTiles) + 3 * x;
                let indexX1Z2 = (3 * (nbXTiles + 1)) * 0 + 3 * x;

                let n1x = normalX1Z1[indexX1Z1];
                let n1y = normalX1Z1[indexX1Z1 + 1];
                let n1z = normalX1Z1[indexX1Z1 + 2];

                let n2x = normalX1Z2[indexX1Z2];
                let n2y = normalX1Z2[indexX1Z2 + 1];
                let n2z = normalX1Z2[indexX1Z2 + 2];

                normalX1Z1[indexX1Z1] = normalX1Z2[indexX1Z2] = (n1x + n2x) / 2;
                normalX1Z1[indexX1Z1 + 1] = normalX1Z2[indexX1Z2 + 1] = (n1y + n2y) / 2;
                normalX1Z1[indexX1Z1 + 2] = normalX1Z2[indexX1Z2 + 2] = (n1z + n2z) / 2;

            }
            chunkX1Z2.attributes.normal.needsUpdate = true;
        }

        if(normalX2Z1.length) {
            for(z = 0; z < nbZTiles + 1; z++) {

                let indexX1Z1 = (3 * (nbXTiles + 1)) * z + 3 * nbXTiles;
                let indexX2Z1 = (3 * (nbXTiles + 1)) * z;

                let n1x = normalX1Z1[indexX1Z1];
                let n1y = normalX1Z1[indexX1Z1 + 1];
                let n1z = normalX1Z1[indexX1Z1 + 2];

                let n2x = normalX2Z1[indexX2Z1];
                let n2y = normalX2Z1[indexX2Z1 + 1];
                let n2z = normalX2Z1[indexX2Z1 + 2];

                normalX1Z1[indexX1Z1] = normalX2Z1[indexX2Z1] = (n1x + n2x) / 2;
                normalX1Z1[indexX1Z1 + 1] = normalX2Z1[indexX2Z1 + 1] = (n1y + n2y) / 2;
                normalX1Z1[indexX1Z1 + 2] = normalX2Z1[indexX2Z1 + 2] = (n1z + n2z) / 2;
            }
            chunkX2Z1.attributes.normal.needsUpdate = true;
        }
    };

};