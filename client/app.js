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
        ee.emit('save', app);
        app.openScreen(id, params);
    });

    ee.on('exit', () => {
        ee.emit('save', app);
    });


    const currentCity = stateManager.getCurrentCity();
    const currentWorldmap = stateManager.getCurrentWorldmap();
    const currentScreen = stateManager.getCurrentScreen();

    if(currentScreen === 'ScreenMap' && currentCity) {
        app.openScreen('ScreenMap', currentCity);
    } else {
        app.openScreen('ScreenWorldmap', currentWorldmap);
    }


});













