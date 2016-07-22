window.addEventListener('load', () => {

    const ee = require('./services/eventEmitter');

    const App = require('./services/App');

    const ScreenA = require('./Model/Screen/ScreenA');
    const ScreenB = require('./Model/Screen/ScreenB');

    const app = new App(ScreenA, ScreenB);

    ee.on('screen', id => {
        app.hideScreen();
        app.showScreen(id);
    });

    app.showScreen('ScreenB');

});













