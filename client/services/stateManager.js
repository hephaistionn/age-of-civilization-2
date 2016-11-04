const IMPORT = 2;
const EXPORT = 1;
const CLOSE = 0;

class StateManager {

    constructor() {
        this.cities = {};
        this.leaders = {};
        this.firstBoot = true;
        this.loadCurrentLeader();
    }

    updateStone(value) {
        this.currentCity.resources.stone += value;
    }

    updateWood(value) {
        this.currentCity.resources.wood += value;
    }

    updateMeat(value) {
        this.currentCity.resources.meat += value;
    }

    updatePopulation(value) {
        this.currentCity.population += value;
    }

    updateWorkers(value) {
        this.currentCity.workers += value;
    }

    updateTrade(id) {
        const trade = this.currentCity.trade;
        if(trade[id] === CLOSE) {
            trade[id] = EXPORT;
        } else if(this.trade[id] === EXPORT) {
            trade[id] = IMPORT;
        } else if(this.trade[id] === IMPORT) {
            trade[id] = CLOSE;
        }
    }

    updateLeaderName(name) {
        this.currentLeader.name = name;
    }

    updateLeaderLevel(level) {
        this.currentLeader.level = level;
    }

    updateLeaderCity(cityId) { //add new city on worldmap of gamer
        if(this.currentLeader.cities.indexOf(cityId) !== -1) return;
        this.currentLeader.cities.push(cityId);
    }

    updateLeaderChallengers(leaderId) {
        if(this.currentLeader.challengers.indexOf(leaderId) !== -1) return;
        this.currentLeader.challengers.push(leaderId);
    }

    updateLeaderCurrentCity(cityId) {
        this.currentLeader.currentCity = cityId;
    }

    getLeader(id) {
        if(this.leaders[id]) {
            return this.leaders[id];
        } else {
            const leader = this.constructor.load(id);
            if(leader) {
                this.leaders[id] = leader;
                return leader;
            } else {
                throw 'No leader with id ' + id;
            }
        }
    }

    getCity(id) {
        if(this.cities[id]) {
            return this.cities[id];
        } else {
            const city = this.constructor.load(id);
            if(city) {
                this.cities[id] = city;
                return city;
            } else {
                throw 'No City with id ' + id;
            }
        }
    }

    loadCurrentLeader(id) {
        if(!id) id = this.getCurrentLeaderId();
        this.playerId = id;
        if(this.playerId) {
            this.firstBoot = false;
            console.info('load local gamer');
            this.currentLeader = this.getLeader(id);
        } else {
            console.info('new gamer');
        }
    }

    loadCity(cityId) {
        this.currentCity = this.getCity(cityId);
        this.currentLeader.currentCityId = cityId;
        return this.currentCity;
    }

    getCurrentCityId() {
        return this.currentLeader ? this.currentLeader.currentCityId : null;
    }

    getCurrentLeader() {
        return this.currentLeader;
    }

    getCities() {
        if(!this.currentLeader) return [];
        const citiesId = this.currentLeader.cities;
        return citiesId.map(cityId => {
            return this.getCity(cityId);
        })
    }

    newLeader(params) {
        const id = this.constructor.computeUUID('leader_');
        const leader = {
            name: params.name,
            level: 1,
            challengers: [],
            cities: [],
            map: {
                camera: {x: 100, z: 70}
            },
            id: id
        };
        this.constructor.save(leader);
        this.leaders[id] = leader;
        this.playerId = id;
        this.setCurrentLeaderId(id);
        this.currentLeader = id;
        this.currentLeader = leader;
        this.savePlayersId(id);
    }

    newCity(params) {
        const id = this.constructor.computeUUID('city_');
        const city = {
            name: params.name,
            leader: params.leader,
            level: params.level || 1,
            type: params.type || 0,
            states: {
                population: 0,
                workers: 0
            },
            resources: {
                wood: 20,
                stone: 0,
                meat: 10
            },
            trade: {
                wood: CLOSE,
                stone: CLOSE,
                meat: CLOSE
            },
            x: params.x,
            y: params.y,
            z: params.z,
            map: {
                camera: {x: 25, z: 25}
            },
            screen: 0,
            id: id
        };
        this.constructor.save(city);
        this.cities[id] = city;
        this.currentLeader.cities.push(id);
        return city;
    }

    getCurrentLeaderId() {
        return (localStorage.getItem('player'));
    }

    setCurrentLeaderId(id) {
        return (localStorage.setItem('player', id || ''));
    }


    getPlayersId() {
        return this.constructor.load('players') || [];
    }

    savePlayersId(playerId) {
        this.players = this.getPlayersId();
        if(this.players.indexOf(playerId) !== -1) return;
        this.players.push(playerId);
        this.constructor.save(this.players, 'players');
    }

    saveGame() {
        this.constructor.save(this.currentLeader);
        if(this.currentCity) {
            this.constructor.save(this.currentCity);
        }
    }

    static save(model, id) {
        const modelString = JSON.stringify(model);
        localStorage.setItem(model.id || id, modelString);
    }

    static load(id) {
        const modelString = localStorage.getItem(id);
        return JSON.parse(modelString);
    }

    static computeUUID(prefix) {
        return prefix + Math.floor((1 + Math.random()) * 0x1000000000).toString(16).substring(1);
    }

    setCurrentScreen(screenId) {
        if(this.currentLeader)
            this.currentLeader.screen = screenId === 'ScreenWorldmap' ? 0 : 1;
        this.firstBoot = false;
    }

    getCurrentScreen() {
        if(this.currentLeader) {
            return this.currentLeader.screen;
        } else {
            return 0;
        }
    }

    saveState(model, screenId) {
        if(screenId === 'ScreenWorldmap') {
            const map = this.currentLeader.map;
            if(model.camera) {
                map.camera.x = model.camera.x;
                map.camera.z = model.camera.z;
            }
        } else {
            const map = this.currentCity.map;
            if(model.camera) {
                map.camera.x = model.camera.x;
                map.camera.z = model.camera.z;
            }
        }

    }

}

module.exports = new StateManager();
