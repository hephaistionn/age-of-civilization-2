const isMobile = require('../../../services/mobileDetection')();

const MonitoringPanelMobile = require('./MonitoringPanelMobile');
const MonitoringPanelPC = require('./MonitoringPanelPC');

if(isMobile){
    module.exports = MonitoringPanelMobile;
}else{
    module.exports = MonitoringPanelPC;
}
