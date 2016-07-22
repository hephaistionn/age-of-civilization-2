module.exports = Map=> {
    Map.prototype.initSurface = function initSurface(config) {
        this.tile_type = config.dataSurfaces;
        this.tile_height = config.dataHeights;
    };
};