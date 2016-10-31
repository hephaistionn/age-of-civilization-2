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

    ee.on('openScreen', id => {
        app.openScreen(id);
    });

    if(stateManager.cityId){
        app.openScreen('ScreenMap');
    }else{
        app.openScreen('ScreenWorldmap');
    }

});













