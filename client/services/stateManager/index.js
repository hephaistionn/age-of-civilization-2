const ee = require('../eventEmitter');

class StateManager {

    constructor() {
        this.cities = {};
        this.leaders = {};
        this.worldmaps = {};
        this.currentLeader = this.loadCurrentLeader();
        this.currentCity = this.loadCurrentCity();
        this.currentWorldmap = this.loadCurrentWorldmap();

        ee.on('save', this.saveGame.bind(this));
        ee.on('openScreen', this.setCurrentScreen.bind(this));

    }

    getCurrentWorldmap(){
        return this.currentWorldmap;
    }

    getCurrentCity(){
        return this.currentCity;
    }

    getCurrentLeader(){
        return this.currentLeader;
    }

    getCurrentScreen(){
        return this.load('currentScreen');
    }

    setCurrentScreen(screenId){
        this.save(screenId, 'currentScreen');
    }

    saveGame(app) {
        const screen = app.getCurrentScreen();
        const currentScreenId = app.getCurrentScreenId();
        if(currentScreenId === 'ScreenWorldmap'){
            screen.syncState(this.currentWorldmap);
            this.save(this.currentWorldmap);
        }else{
            screen.syncState(this.currentCity);
            this.save(this.currentCity);
        }
        this.save(this.currentLeader);
    }
}

require('./cityManager')(StateManager);
require('./leaderManager')(StateManager);
require('./storageManager')(StateManager);
require('./worldmapManager')(StateManager);

module.exports = new StateManager();
