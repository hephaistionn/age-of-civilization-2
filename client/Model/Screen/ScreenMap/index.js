const isMobile = require('../../../services/mobileDetection')();

const ScreenMapMobile = require('./ScreenMapMobile');
const ScreenMapPC = require('./ScreenMapPC');

if(isMobile){
    module.exports = ScreenMapMobile;
}else{
    module.exports = ScreenMapPC;
}