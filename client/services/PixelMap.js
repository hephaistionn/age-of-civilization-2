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
            dataSurfaces[i] = color[0]; //set height type
            dataHeights[i] = color[1]; //set surface type
            dataForests[i] = color[2]; //set forest type
        }

        data.ySize = context.height;
        data.xSize = context.width;
        data.dataHeights = dataHeights;
        data.dataSurfaces = dataSurfaces;
        data.dataForests = dataForests;
        return data;
    }
};
