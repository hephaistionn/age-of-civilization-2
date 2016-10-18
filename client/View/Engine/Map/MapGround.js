const THREE = require('../../../services/threejs');
const materialGround = require('./../Material/materialGround');
const materialWater = require('./../Material/materialWater');
const ee = require('../../../services/eventEmitter');

module.exports = Map=> {

    Map.prototype.initGround = function initGround(model) {
        this.materialGround = materialGround;
        this.materialGround.uniforms.textureA.value = THREE.loadTexture("pic/rock_0.jpg");
        this.materialGround.uniforms.textureB.value = THREE.loadTexture("pic/grass_0.jpg");
        this.materialGround.uniforms.textureC.value = THREE.loadTexture("pic/grass_1.jpg");
        this.materialGround.uniforms.textureD.value = THREE.loadTexture("pic/soil_0.jpg");
        //this.materialGround = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe : true});
        //this.materialGround = new THREE.MeshPhongMaterial( { color: 0x555555 } );
        //this.materialWater = new THREE.MeshPhongMaterial({color: 0x3333ff, map : THREE.ImageUtils.loadTexture('pic/water_0.jpg'), transparent: true, shininess: 90, opacity: 0.66 });
        this.materialWater = materialWater;
        this.waterOscillation = 1;

        const nbPointX = model.nbPointX;
        const nbPointZ = model.nbPointZ;
        const nbTileX = model.nbTileX;
        const nbTileZ = model.nbTileZ;

        const chunksTiles = [0];
        for(let x = 0; x < nbTileX; x++) {
            if(chunksTiles[chunksTiles.length - 1] === this.tileByChunk) {
                chunksTiles.push(1);
            } else {
                chunksTiles[chunksTiles.length - 1]++;
            }
        }

        const length = chunksTiles.length;
        let x, z, offsetXTiles, offsetZTiles, nbXTiles, nbZTiles;

        function findVextexUnderWater(vertex) {
            return vertex < 3;
        }

        this.chunks = [];
        this.chunksList = [];
        for(x = 0; x < length; x++) {
            this.chunks[x] = [];
            for(z = 0; z < length; z++) {

                nbXTiles = chunksTiles[x];
                nbZTiles = chunksTiles[z];

                offsetXTiles = x * this.tileByChunk;
                offsetZTiles = z * this.tileByChunk;

                let chunkMesh = this.createSurfaceMesh(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, model);

                chunkMesh.position.set(offsetXTiles * this.tileSize, 0, offsetZTiles * this.tileSize);
                chunkMesh.updateMatrixWorld();
                chunkMesh.matrixAutoUpdate = false;
                chunkMesh.matrixWorldNeedsUpdate = false;
                chunkMesh.receiveShadow = true;
                this.element.add(chunkMesh);

                this.chunks[x][z] = chunkMesh;
                this.chunksList.push(chunkMesh);

            }
        }

    };

    Map.prototype.createWater = function createWater(xSize, zSize) {
        const waterGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, 1, 1);
        let waterMesh = new THREE.Mesh(waterGeometry, this.materialWater);
        waterMesh.position.set(0, 3, 0);
        waterMesh.updateMatrix();
        waterMesh.updateMatrixWorld();
        waterMesh.matrixAutoUpdate = false;
        waterMesh.matrixWorldNeedsUpdate = false;
        waterMesh.receiveShadow = true;
        return waterMesh;
    };

    Map.prototype.updateWater = function updateWater(dt) {
        const uniformTime = this.materialWater.uniforms.time;
        const uniformProgress = this.materialWater.uniforms.progress;
        const uniformCameraPosition = this.materialWater.uniforms.cameraPosition;
        uniformTime.value += dt / 1000 * this.waterOscillation;
        uniformProgress.value += dt / 2400;
        const camera = this.element.parent.camera;
        if(camera) {
            uniformCameraPosition.value = camera.position;
        }

        if(uniformTime.value > 1) {
            this.waterOscillation = -1;
            uniformTime.value = 1;
        } else if(uniformTime.value < 0) {
            this.waterOscillation = 1;
            uniformTime.value = 0;
        }
    };

    Map.prototype.createSurfaceMesh = function createSurfaceMesh(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, model) {
        const chunkGeo = this.createSurfaceGeo(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, model);
        const chunkMesh = new THREE.Mesh(chunkGeo, this.materialGround);
        chunkGeo.computeBoundingBox();
        if(chunkGeo.boundingBox.min.y <= 3) {
            const waterMesh = this.createWater(nbXTiles * this.tileSize, nbZTiles * this.tileSize, chunkMesh);
            chunkMesh.add(waterMesh);
        }
        return chunkMesh;
    };

    Map.prototype.createSurfaceGeo = function createSurfaceGeo(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, model) {
        const xSize = nbXTiles * this.tileSize;
        const zSize = nbZTiles * this.tileSize;

        const chunkGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, nbXTiles, nbZTiles);

        const position = chunkGeometry.attributes.position;
        const posArray = position.array;
        const length = position.count;
        const normalArray = new Float32Array(length * 3);
        const groundArry = new Float32Array(length);

        for(let i = 0; i < length; i++) {
            let tileX = offsetXTiles + posArray[i * 3] / this.tileSize;
            let tileZ = offsetZTiles + posArray[i * 3 + 2] / this.tileSize;
            let index = tileZ * model.nbPointX + tileX;

            let pointsType = model.pointsType[index] || 0;
            let pointsHeights = model.pointsHeights[index] || 0;
            groundArry[i] = pointsType;
            posArray[i * 3 + 1] = pointsHeights / 255 * this.tileHeight;

            let dx = model.pointsNormal[index * 3] / 127 / this.tileSize;
            let dy = model.pointsNormal[index * 3 + 1] / 127 / this.tileHeight;
            let dz = model.pointsNormal[index * 3 + 2] / 127 / this.tileSize;
            let l = Math.sqrt(dx * dx + dy * dy + dz * dz);

            normalArray[i * 3] = dx / l;
            normalArray[i * 3 + 1] = dy / l;
            normalArray[i * 3 + 2] = dz / l;
        }

        chunkGeometry.addAttribute('grounds', new THREE.BufferAttribute(groundArry, 1));
        chunkGeometry.addAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
        chunkGeometry.attributes.position.needsUpdate = true;
        return chunkGeometry;
    };


};
