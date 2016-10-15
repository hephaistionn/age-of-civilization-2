const isMobile = require('../../../services/mobileDetection')();

const ScreenWorldmapMobile = require('./ScreenWorldmapMobile');
const ScreenWorldmapPC = require('./ScreenWorldmapPC');

if(isMobile) {
    module.exports = ScreenWorldmapMobile;
} else {
    module.exports = ScreenWorldmapPC;
}