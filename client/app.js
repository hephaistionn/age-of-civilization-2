window.addEventListener('load', () => {

    const ee = require('./services/eventEmitter');

    const App = require('./services/App');

    const ScreenWorldmap = require('./Model/Screen/ScreenWorldmap');
    const ScreenMap = require('./Model/Screen/ScreenMap');

    const app = new App(ScreenWorldmap, ScreenMap);

    ee.on('screen', id => {
        app.hideScreen();
        app.showScreen(id);
    });

    app.showScreen('ScreenMap');

});













