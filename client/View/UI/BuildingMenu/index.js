const isMobile = require('../../../services/mobileDetection')();

const BuildingMenuMobile = require('./BuildingMenuMobile');
const BuildingMenuPC = require('./BuildingMenuPC');

if(isMobile){
    module.exports = BuildingMenuMobile;
}else{
    module.exports = BuildingMenuPC;
}
