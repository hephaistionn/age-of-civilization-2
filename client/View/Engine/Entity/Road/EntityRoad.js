const THREE = require('../../../../services/threejs');
const materialRoad = require('../../Material/materialRoad');
const UVpath = require('../../../../services/UVpath');
const config = require('../../config');
const tileSize = config.tileSize;
const tileMaxHeight = config.tileMaxHeight;

class EntityRoad {

    constructor(model) {
        this.model = model;

        this.tileByChunk = config.tileByChunk;
        this.tileSize = config.tileSize;
        this.nbTileX = this.model.map.nbTileX;
        this.nbTileZ = this.model.map.nbTileZ;
        this.tileMaxHeight = config.tileMaxHeight;
        this.nbPointX = this.model.map.nbPointX;
        this.nbPointZ = this.model.map.nbPointZ;
        this.pointsHeights = this.model.map.pointsHeights;
        this.pointsNormal = this.model.map.pointsNormal;
        this.MAX_TILES = 75;
        this.VERTEX_BY_TILE = 6;
        this.MAX_VERTEX =  this.VERTEX_BY_TILE * this.MAX_TILES;
        this.materialRoad = materialRoad;

        this.element = new THREE.Object3D();
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = false;
        this.initChunks(model);
        this.updateState();
    }

    initChunks(){
        const nbTileX = this.nbTileX;
        const chunksTiles = [0];
        for(let x = 0; x < nbTileX; x++) {
            if(chunksTiles[chunksTiles.length - 1] === this.tileByChunk) {
                chunksTiles.push(1);
            } else {
                chunksTiles[chunksTiles.length - 1]++;
            }
        }

        const chunks = [];
        const flatChunks = [];
        const l = chunksTiles.length;
        let x, z, offsetXTiles, offsetZTiles, nbXTiles, nbZTiles, roadMesh;
        for(x = 0; x < l; x++) {
            chunks[x] = [];
            for(z = 0; z < l; z++) {
                nbXTiles = chunksTiles[x];
                nbZTiles = chunksTiles[z];
                offsetXTiles = x * this.tileByChunk;
                offsetZTiles = z * this.tileByChunk;
                roadMesh = this.createRoadChunk(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles);
                chunks[x][z] = roadMesh.geometry;
                flatChunks.push(roadMesh.geometry);
                this.element.add(roadMesh);
            }
        }

        this.chunks = chunks;
        this.flatChunks = flatChunks;
    }


    createRoadChunk(){
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array( this.MAX_VERTEX * 3 );
        const uv = new Float32Array( this.MAX_VERTEX * 2 );
        const type = new Float32Array( this.MAX_VERTEX * 1 );
        const normal = new Float32Array( this.MAX_VERTEX * 3 );
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
        geometry.addAttribute( 'type', new THREE.BufferAttribute( type, 1 ) );
        geometry.addAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );
        geometry.setDrawRange( 0, 3 );
        const mesh = new THREE.Mesh(geometry, this.materialRoad);
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;
        mesh.matrixWorldNeedsUpdate = false;
        mesh.receiveShadow = true;
        mesh.drawMode = THREE.TrianglesDrawMode;
        return mesh;
    }

    updateState() {
        const chunks = this.chunks;
        const grid = this.model.map.grid;
        const nodes = grid.nodes;
        const sizeNode = grid.sizeNode;
        const tileSize = this.tileSize;
        const indexWalkable = grid.indexWalkable;
        const indexX = grid.indexX;
        const indexY = grid.indexY;
        const l = nodes.length;
        const nbChunk = this.flatChunks.length;

        let roadType, x, z, chunkX, chunkZ, i , vx, vz = 0;
        let ctn, ctnUV, ctnType = 0;
        let roadGeoetry;
        let positions;
        let uvs;
        let normals;
        let types;
        let a,b,c,d,e,f,g,h, uvIndex, uvref;
        let absoluteIndex;
        let dx, dy, dz, norm;

        for(i=0; i<nbChunk; i++){
            this.flatChunks[i].drawRange.count = 1; //avoid WARNING: Render count or primcount is 0.
        }

        for(i = 0; i < l; i+=sizeNode ){
            roadType = nodes[i + indexWalkable];
            if(roadType > 1){
                x = nodes[i + indexX];
                z = nodes[i + indexY];
                chunkX = Math.floor(x / this.tileByChunk);
                chunkZ = Math.floor(z / this.tileByChunk);
                roadGeoetry = chunks[chunkX][chunkZ];
                positions = roadGeoetry.attributes.position.array;
                normals = roadGeoetry.attributes.normal.array;
                uvs = roadGeoetry.attributes.uv.array;
                types = roadGeoetry.attributes.type.array;

                a = grid.isWalkableAt(x-1,z-1)>1?1:0;
                b = grid.isWalkableAt(x,z-1)>1?1:0;
                c = grid.isWalkableAt(x+1,z-1)>1?1:0;
                d = grid.isWalkableAt(x+1,z)>1?1:0;
                e = grid.isWalkableAt(x+1,z+1)>1?1:0;
                f = grid.isWalkableAt(x,z+1)>1?1:0;
                g = grid.isWalkableAt(x-1,z+1)>1?1:0;
                h = grid.isWalkableAt(x-1,z)>1?1:0;
                uvIndex = a*128+b*64+c*32+d*16+e*8+f*4+g*2+h;
                uvref = UVpath[uvIndex];

                if(roadGeoetry.drawRange.count === 1){
                    ctn = 0; //avoid WARNING: Render count or primcount is 0.
                }else{
                    ctn = roadGeoetry.drawRange.count*3;
                }

                ctnUV = ctn*2/3;
                ctnType = ctn/3;

                vx = x;
                vz = z + 1;
                absoluteIndex = vz * this.nbPointX + vx;
                dx = this.pointsNormal[absoluteIndex * 3]/127/this.tileSize;
                dy = this.pointsNormal[absoluteIndex * 3 +1]/127/this.tileMaxHeight;
                dz = this.pointsNormal[absoluteIndex * 3 + 2]/127/this.tileSize;
                norm = Math.sqrt(dx*dx+dy*dy+dz*dz);
                dx /= norm;
                dy /= norm;
                dz /= norm;
                normals[ctn] = dx;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = dy;
                positions[ctn++] = this.pointsHeights[absoluteIndex]/ 255 * this.tileMaxHeight+0.05;
                normals[ctn] = dz;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[6];
                uvs[ctnUV++] = uvref[7];
                types[ctnType++] = roadType;

                vx = x + 1;
                vz = z;
                absoluteIndex = vz * this.nbPointX + vx;
                dx = this.pointsNormal[absoluteIndex * 3]/127/this.tileSize;
                dy = this.pointsNormal[absoluteIndex * 3 +1]/127/this.tileMaxHeight;
                dz = this.pointsNormal[absoluteIndex * 3 + 2]/127/this.tileSize;
                norm = Math.sqrt(dx*dx+dy*dy+dz*dz);
                dx /= norm;
                dy /= norm;
                dz /= norm;
                normals[ctn] = dx;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = dy;
                positions[ctn++] = this.pointsHeights[absoluteIndex]/ 255 * this.tileMaxHeight+0.05;
                normals[ctn] = dz;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[2];
                uvs[ctnUV++] = uvref[3];
                types[ctnType++] = roadType;

                vx = x;
                vz = z;
                absoluteIndex = vz * this.nbPointX + vx;
                dx = this.pointsNormal[absoluteIndex * 3]/127/this.tileSize;
                dy = this.pointsNormal[absoluteIndex * 3 +1]/127/this.tileMaxHeight;
                dz = this.pointsNormal[absoluteIndex * 3 + 2]/127/this.tileSize;
                norm = Math.sqrt(dx*dx+dy*dy+dz*dz);
                dx /= norm;
                dy /= norm;
                dz /= norm;
                normals[ctn] = dx;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = dy;
                positions[ctn++] = this.pointsHeights[absoluteIndex]/ 255 * this.tileMaxHeight+0.05;
                normals[ctn] = dz;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[0];
                uvs[ctnUV++] = uvref[1];
                types[ctnType++] = roadType;

                vx = x + 1;
                vz = z + 1;
                absoluteIndex = vz * this.nbPointX + vx;
                dx = this.pointsNormal[absoluteIndex * 3]/127/this.tileSize;
                dy = this.pointsNormal[absoluteIndex * 3 +1]/127/this.tileMaxHeight;
                dz = this.pointsNormal[absoluteIndex * 3 + 2]/127/this.tileSize;
                norm = Math.sqrt(dx*dx+dy*dy+dz*dz);
                dx /= norm;
                dy /= norm;
                dz /= norm;
                normals[ctn] = dx;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = dy;
                positions[ctn++] = this.pointsHeights[absoluteIndex]/ 255 * this.tileMaxHeight+0.05;
                normals[ctn] = dz;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[4];
                uvs[ctnUV++] = uvref[5];
                types[ctnType++] = roadType;

                vx = x + 1;
                vz = z;
                absoluteIndex = vz * this.nbPointX + vx;
                dx = this.pointsNormal[absoluteIndex * 3]/127/this.tileSize;
                dy = this.pointsNormal[absoluteIndex * 3 +1]/127/this.tileMaxHeight;
                dz = this.pointsNormal[absoluteIndex * 3 + 2]/127/this.tileSize;
                norm = Math.sqrt(dx*dx+dy*dy+dz*dz);
                dx /= norm;
                dy /= norm;
                dz /= norm;
                normals[ctn] = dx;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = dy;
                positions[ctn++] = this.pointsHeights[absoluteIndex]/ 255 * this.tileMaxHeight+0.05;
                normals[ctn] = dz;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[2];
                uvs[ctnUV++] = uvref[3];
                types[ctnType++] = roadType;

                vx = x;
                vz = z + 1;
                absoluteIndex = vz * this.nbPointX + vx;
                dx = this.pointsNormal[absoluteIndex * 3]/127/this.tileSize;
                dy = this.pointsNormal[absoluteIndex * 3 +1]/127/this.tileMaxHeight;
                dz = this.pointsNormal[absoluteIndex * 3 + 2]/127/this.tileSize;
                norm = Math.sqrt(dx*dx+dy*dy+dz*dz);
                dx /= norm;
                dy /= norm;
                dz /= norm;
                normals[ctn] = dx;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = dy;
                positions[ctn++] = this.pointsHeights[absoluteIndex]/ 255 * this.tileMaxHeight+0.05;
                normals[ctn] = dz;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[6];
                uvs[ctnUV++] = uvref[7];
                types[ctnType++] = roadType;

                roadGeoetry.drawRange.count = ctn/3;
                roadGeoetry.attributes.position.needsUpdate = true;
                roadGeoetry.attributes.uv.needsUpdate = true;
                roadGeoetry.attributes.type.needsUpdate = true;
                roadGeoetry.attributes.normal.needsUpdate = true;

            }
        }

    }

}
module.exports = EntityRoad;
