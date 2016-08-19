const THREE = require('../../../../services/threejs');
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
        const MAX_TILES = 50;
        this.VERTEX_BY_TILE = 18;
        this.MAX_VERTEX =  this.VERTEX_BY_TILE * MAX_TILES;

        this.materialRoad = new THREE.MeshPhongMaterial( { map : THREE.ImageUtils.loadTexture('pic/path_opacity.png')} );
        this.materialRoad.map.flipY = false;
        //this.materialRoad = new THREE.MeshPhongMaterial( { color: 0x550000 } );

        this.element = new THREE.Object3D();
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;
        this.element.castShadow = false;
        this.initChunks(model);
        //this.updateState();
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


    createRoadChunk(offsetXTiles, offsetZTiles, nbXTiles, nbZTiles){
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array( this.MAX_VERTEX * 3 );
        const uv = new Float32Array( this.MAX_VERTEX * 2 );
        const normal = new Float32Array( this.MAX_VERTEX * 3 );

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
        geometry.addAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );
        geometry.setDrawRange( 0, 3 );
        const mesh = new THREE.Mesh(geometry, this.materialRoad);
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;
        mesh.matrixWorldNeedsUpdate = false;
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
        let ctn, ctnUV = 0;
        let roadGeoetry;
        let positions;
        let uvs;
        let normals;
        let a,b,c,d,e,f,g,h, uvIndex, uvref;

        for(i=0; i<nbChunk; i++){
            this.flatChunks[i].drawRange.count = 0;
        }

        for(i = 0; i < l; i+=sizeNode ){
            roadType = nodes[i + indexWalkable];
            if(roadType > 1){
                roadType = nodes[i + indexWalkable];
                x = nodes[i + indexX];
                z = nodes[i + indexY];
                chunkX = Math.floor(x / this.tileByChunk);
                chunkZ = Math.floor(z / this.tileByChunk);
                roadGeoetry = chunks[chunkX][chunkZ];
                positions = roadGeoetry.attributes.position.array;
                normals = roadGeoetry.attributes.normal.array;
                uvs = roadGeoetry.attributes.uv.array;

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

                ctn = roadGeoetry.drawRange.count;
                ctnUV = ctn*2/3;

                vx = x;
                vz = z + 1;
                normals[ctn] = 0;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = 1;
                positions[ctn++] = this.pointsHeights[vz * this.nbPointX + vx]/ 255 * this.tileMaxHeight+0.1;
                normals[ctn] = 0;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[6]/4;
                uvs[ctnUV++] = uvref[7]/4;



                vx = x + 1;
                vz = z;
                normals[ctn] = 0;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = 1;
                positions[ctn++] = this.pointsHeights[vz * this.nbPointX + vx]/ 255 * this.tileMaxHeight+0.1;
                normals[ctn] = 0;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[2]/4;
                uvs[ctnUV++] = uvref[3]/4;

                vx = x;
                vz = z;
                normals[ctn] = 0;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = 1;
                positions[ctn++] = this.pointsHeights[vz * this.nbPointX + vx]/ 255 * this.tileMaxHeight+0.1;
                normals[ctn] = 0;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[0]/4;
                uvs[ctnUV++] = uvref[1]/4;

                vx = x + 1;
                vz = z + 1;
                normals[ctn] = 0;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = 1;
                positions[ctn++] = this.pointsHeights[vz * this.nbPointX + vx]/ 255 * this.tileMaxHeight+0.1;
                normals[ctn] = 0;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[4]/4;
                uvs[ctnUV++] = uvref[5]/4;

                vx = x + 1;
                vz = z;
                normals[ctn] = 0;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = 1;
                positions[ctn++] = this.pointsHeights[vz * this.nbPointX + vx]/ 255 * this.tileMaxHeight+0.1;
                normals[ctn] = 0;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[2]/4;
                uvs[ctnUV++] = uvref[3]/4;

                vx = x;
                vz = z + 1;
                normals[ctn] = 0;
                positions[ctn++] = vx * tileSize;
                normals[ctn] = 1;
                positions[ctn++] = this.pointsHeights[vz * this.nbPointX + vx]/ 255 * this.tileMaxHeight+0.1;
                normals[ctn] = 0;
                positions[ctn++] = vz * tileSize;
                uvs[ctnUV++] = uvref[6]/4;
                uvs[ctnUV++] = uvref[7]/4;

                roadGeoetry.drawRange.count = ctn;
                roadGeoetry.attributes.position.needsUpdate = true;
                roadGeoetry.attributes.uv.needsUpdate = true;
                roadGeoetry.attributes.normal.needsUpdate = true;

            }
        }

    }

}
module.exports = EntityRoad;
