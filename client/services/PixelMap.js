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
        let dataForests = new Uint8ClampedArray(size);

        for(let i = 0; i < size; i++) {
            color = ImageData.slice(i * 4, i * 4 + 4);
            dataSurfaces[i] = color[0]; //set surface type
            dataHeights[i] = color[1]; //set surface height
            dataForests[i] = color[2]; //set forest type
        }

        data.tile_nz = context.height;
        data.tile_nx = context.width;

        const dataTrees = [];
        for(let i = 0; i < size; i++) {
            let value = dataForests[i];
            if(value === 0) continue;
            let x = i % data.tile_nz;
            let z = Math.floor(i / data.tile_nz);
            let y = dataHeights[z * data.tile_nx + x] / 255;
            dataTrees.push(x);
            dataTrees.push(y);
            dataTrees.push(z);
        }

        data.dataHeights = dataHeights;
        data.dataSurfaces = dataSurfaces;
        data.dataTrees = dataTrees;
        return data;
    }
};
