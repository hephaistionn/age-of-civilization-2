const THREE = require('../../../services/threejs');
const materialWorldmap = require('./../Material/materialWorldmap');
const materialWater = require('./../Material/materialWater');
const ee = require('../../../services/eventEmitter');

module.exports = Worldmap => {

    Worldmap.prototype.initGround = function initGround(model) {
        this.materialWorldmap = materialWorldmap;
        //this.materialWorldmap = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe : true});
        //this.materialWorldmap = new THREE.MeshPhongMaterial( { color: 0x555555 } );
        //this.materialWater = new THREE.MeshPhongMaterial({color: 0x3333ff, map : THREE.ImageUtils.loadTexture('pic/water_0.jpg'), transparent: true, shininess: 90, opacity: 0.66 });
        this.materialWater = materialWater;
        this.materialWater.uniforms.opacity.value = 0.80;
        this.materialWater.uniforms.size.value = 10.0;

        this.waterOscillation = 1;

        const nbPointX = model.nbPointX;
        const nbPointZ = model.nbPointZ;
        const nbTileX = model.nbTileX;
        const nbTileZ = model.nbTileZ;

        this.mapGeo = this.createSurface(nbTileX, nbTileZ, model);
        const mapMesh = new THREE.Mesh(this.mapGeo, this.materialWorldmap);
        const waterMesh = this.createWater(nbTileX, nbTileZ, mapMesh);

        mapMesh.add(waterMesh);
        mapMesh.position.set(0, 0, 0);
        mapMesh.updateMatrixWorld();
        mapMesh.matrixAutoUpdate = false;
        mapMesh.matrixWorldNeedsUpdate = false;
        mapMesh.receiveShadow = true;

        this.touchSurface = [waterMesh];
        this.waterMesh = waterMesh;

        return mapMesh;
    };

    Worldmap.prototype.createWater = function createWater(nbTileX, nbTileZ) {
        const xSize = nbTileX * this.tileSize * 2;
        const zSize = nbTileZ * this.tileSize * 2;
        const waterGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, 1, 1);
        let waterMesh = new THREE.Mesh(waterGeometry, this.materialWater);
        waterMesh.position.set(-xSize / 4, 3, -zSize / 4);
        waterMesh.updateMatrix();
        waterMesh.updateMatrixWorld();
        waterMesh.matrixAutoUpdate = false;
        waterMesh.matrixWorldNeedsUpdate = false;
        waterMesh.receiveShadow = true;
        return waterMesh;
    };

    Worldmap.prototype.updateWater = function updateWater(dt) {
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

    Worldmap.prototype.createSurface = function createSurface(nbXTiles, nbZTiles, model) {
        const xSize = nbXTiles * this.tileSize;
        const zSize = nbZTiles * this.tileSize;

        const chunkGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, nbXTiles, nbZTiles);

        const position = chunkGeometry.attributes.position;
        const posArray = position.array;
        const length = position.count;
        const normalArray = new Float32Array(length * 3);
        const groundArry = new Float32Array(length);

        for(let i = 0; i < length; i++) {
            let tileX = posArray[i * 3] / this.tileSize;
            let tileZ = posArray[i * 3 + 2] / this.tileSize;
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

    Worldmap.prototype.refreshTexture = function refreshTexture() {
        this.materialWorldmap.uniforms.textureA.value = THREE.loadTexture("pic/desert_0big.jpg");
        this.materialWorldmap.uniforms.textureB.value = THREE.loadTexture("pic/grass_0big.jpg");
        this.materialWorldmap.uniforms.textureC.value = THREE.loadTexture("pic/forest_0big.jpg");
        this.materialWorldmap.uniforms.textureD.value = THREE.loadTexture("pic/grass_1.jpg");
    }


};
