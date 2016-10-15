module.exports = class PixelMap {

    constructor() {
        this.tileSize = 0;
        this.heightMax = 4;
    }

    compute(url, cb) {
        return this.loadImage(url, (context)=> {
            const dataMap = this.getData(context);
            cb(dataMap);
        })
    }

    loadImage(url, cb) {
        let image = new Image();
        image.onload = function() {
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            let context = canvas.getContext('2d');
            context.width = this.width;
            context.height = this.height;
            context.drawImage(this, 0, 0);
            cb(context)
        };
        image.src = url;
    }

    getData(context) {
        let imageData = context.getImageData(0, 0, context.width, context.height).data;
        let size = context.height * context.width;
        let data = {};
        let dataHeights = new Uint8Array(size);
        let dataSurfaces = new Uint8Array(size);
        let dataResources = new Uint8Array(size);

        var index = 0;
        for(let i = 0; i < size; i++) {
            index = i * 4;
            dataSurfaces[i] = imageData[index]; //set surface type
            dataHeights[i] = imageData[index + 1]; //set surface height
            dataResources[i] = imageData[index + 2]; //set forest type
        }

        data.nbPointZ = context.height;
        data.nbPointX = context.width;
        data.nbTileZ = context.height - 1;
        data.nbTileX = context.width - 1;

        data.pointsHeights = dataHeights;
        data.pointsType = dataSurfaces;
        data.pointsNormal = this.computeNormals(dataHeights, data.nbPointX, data.nbPointZ);
        data.tilesHeight = this.averageByTile(dataHeights, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesTilt = this.rangeByTile(dataHeights, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesType = this.averageByTile(dataSurfaces, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesResource = this.pixelByTile(dataResources, data.nbTileX, data.nbTileZ, data.nbPointX);

        return data;
    }

    rangeByTile(points, nbTileX, nbTileZ, nbPointX) {

        const tilts = new Uint8Array(nbTileX * nbTileZ);
        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index1 = z * nbPointX + x;
                let index2 = z * nbPointX + (x + 1);
                let index3 = (z + 1) * nbPointX + x;
                let index4 = (z + 1) * nbPointX + (x + 1);

                let indexTile = z * nbTileX + x;

                let v1 = points[index1];
                let v2 = points[index2];
                let v3 = points[index3];
                let v4 = points[index4];

                tilts[indexTile] = Math.max(v1, v2, v3, v4) - Math.min(v1, v2, v3, v4);
            }
        }

        return tilts;
    }

    averageByTile(points, nbTileX, nbTileZ, nbPointX) {

        const tiles = new Uint8Array(nbTileX * nbTileZ);

        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index1 = z * nbPointX + x;
                let index2 = z * nbPointX + (x + 1);
                let index3 = (z + 1) * nbPointX + x;
                let index4 = (z + 1) * nbPointX + (x + 1);

                let indexTile = z * nbTileX + x;

                let v1 = points[index1];
                let v2 = points[index2];
                let v3 = points[index3];
                let v4 = points[index4];

                tiles[indexTile] = (v1 + v2 + v3 + v4) / 4;
            }
        }

        return tiles;
    }

    pixelByTile(points, nbTileX, nbTileZ, nbPointX) {
        const tiles = new Uint8Array(nbTileX * nbTileZ);
        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index = z * nbPointX + x;
                let indexTile = z * nbTileX + x;
                tiles[indexTile] = points[index];
            }
        }
        return tiles;
    }


    computeNormals(dataHeights, nbPointX, nbPointZ) {
        const points = new Int8Array(nbPointX * nbPointZ * 3);
        let i = 0;
        for(let z = 0; z < nbPointZ; z++) {
            for(let x = 0; x < nbPointX; x++) {

                const Ax = 0;
                const Ay = dataHeights[z * nbPointX + x] / 255;
                const Az = 0;

                const Bx = 0;
                const By = z - 1 < 0 ? Ay : dataHeights[(z - 1) * nbPointX + x] / 255;
                const Bz = -1;

                const Cx = -1;
                const Cy = x - 1 < 0 ? Ay : dataHeights[z * nbPointX + (x - 1)] / 255;
                const Cz = 0;

                const Dx = 0;
                const Dy = z + 1 > nbPointZ - 1 ? Ay : dataHeights[(z + 1) * nbPointX + x] / 255;
                const Dz = 1;

                const Ex = 1;
                const Ey = x + 1 > nbPointX - 1 ? Ay : dataHeights[z * nbPointX + (x + 1)] / 255;
                const Ez = 0;

                const v1x = Bx - Ax;
                const v1y = By - Ay;
                const v1z = Bz - Az;
                const v2x = Cx - Ax;
                const v2y = Cy - Ay;
                const v2z = Cz - Az;
                const v3x = Dx - Ax;
                const v3y = Dy - Ay;
                const v3z = Dz - Az;
                const v4x = Ex - Ax;
                const v4y = Ey - Ay;
                const v4z = Ez - Az;

                const nor1x = v1y * v2z - v1z * v2y;
                const nor1y = v1z * v2x - v1x * v2z;
                const nor1z = v1x * v2y - v1y * v2x;
                const nor2x = v3y * v4z - v3z * v4y;
                const nor2y = v3z * v4x - v3x * v4z;
                const nor2z = v3x * v4y - v3y * v4x;

                let dx = nor1x + nor2x;
                let dy = nor1y + nor2y;
                let dz = nor1z + nor2z;

                const length = Math.sqrt(dx * dx + dz * dz + dy * dy);
                points[i++] = Math.floor(127 * dx / length);
                points[i++] = Math.floor(127 * dy / length);
                points[i++] = Math.floor(127 * dz / length);

            }
        }
        return points;
    }

};
