window.addEventListener('load', () => {

    const ee = require('./services/eventEmitter');

    const App = require('./services/App');
    const ScreenWorldmap = require('./Model/Screen/ScreenWorldmap');
    const ScreenMap = require('./Model/Screen/ScreenMap');

    const stateManager = require('./services/stateManager');

    const app = new App(ScreenWorldmap, ScreenMap);


    ee.on('closeScreen', id => {
        app.closeScreen(id);
    });

    ee.on('openScreen', (id, params) => {
        app.openScreen(id, params);
    });

    if(stateManager.getCurrentScreen()) {
        const cityId = stateManager.getCurrentCityId();
        const model = stateManager.loadCity(cityId).map;
        app.openScreen('ScreenMap', model);
    } else {
        const model = stateManager.getCurrentLeader();
        app.openScreen('ScreenWorldmap', model);
    }

});













