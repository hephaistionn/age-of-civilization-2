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
        let ImageData = context.getImageData(0, 0, context.width, context.height).data;
        let size = context.height * context.width;
        let data = {};
        let color;
        let dataHeights = new Uint8ClampedArray(size);
        let dataSurfaces = new Uint8ClampedArray(size);
        let dataResources = new Uint8ClampedArray(size);

        for(let i = 0; i < size; i++) {
            color = ImageData.slice(i * 4, i * 4 + 4);
            dataSurfaces[i] = color[0]; //set surface type
            dataHeights[i] = color[1]; //set surface height
            dataResources[i] = color[2]; //set forest type
        }

        data.nbPointZ = context.height;
        data.nbPointX = context.width;
        data.nbTileZ = context.height - 1;
        data.nbTileX = context.width - 1;

        data.pointsHeights = dataHeights;
        data.pointsType = dataSurfaces;

        data.tilesHeight = this.averageByTile(dataHeights, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesTilt = this.rangeByTile(dataHeights, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesType = this.averageByTile(dataSurfaces, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesResource = this.pixelByTile(dataResources, data.nbTileX, data.nbTileZ, data.nbPointX);

        return data;
    }

    rangeByTile(points, nbTileX, nbTileZ, nbPointX) {

        const tilts = new Uint8ClampedArray(nbTileX * nbTileZ);
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

        const tiles = new Uint8ClampedArray(nbTileX * nbTileZ);

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
        const tiles = new Uint8ClampedArray(nbTileX * nbTileZ);
        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index = z * nbPointX + x;
                let indexTile = z * nbTileX + x;
                tiles[indexTile] = points[index];
            }
        }
        return tiles;
    }


};
