const IMPORT = 2;
const EXPORT = 1;
const CLOSE = 0;

class StateManager {

    constructor() {

        this.cities = {};
        this.leaders = {};
        this.playerId = this.getPlayerId() || this.newLeader({name: 'SARGON'}).id; //get playerId, previous player or new player
        this.setPlayerId(this.playerId); //save the current playerId, used for case of a new player
        this.currentLeader = this.getLeader(this.playerId); //get data about currentPlayer
        this.cityId = this.getCityId(); //get a previous displayed city;
        this.currentCity =  this.cityId ? this.getCity(this.cityId) : null; //get a data of previous displayed city if there are a previous displayed city

        this.players = this.getPlayersId();

        window.addEventListener('beforeunload', this.saveGame.bind(this));
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

    loadCurrentCity(id) {
        this.currentCity = this.getCity(id);
    }

    updateLeaderName(name) {
        this.currentLeader.name = name;
    }
    updateLeaderLevel(level) {
        this.currentLeader.level = level;
    }
    updateLeaderCity(cityId) {
        if(this.currentLeader.cities.indexOf(cityId) !== -1) return;
        this.currentLeader.cities.push(cityId);
    }
    updateLeaderChallengers(leaderId) {
        if(this.currentLeader.challengers.indexOf(leaderId) !== -1) return;
        this.currentLeader.challengers.push(leaderId);
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
                throw 'No city with id ' + id;
            }
        }
    }

    newLeader(params) {
        const id = this.constructor.computeUUID('leader_');
        const leader = {
            name: params.name,
            level: 1,
            challengers: [],
            cities: [],
            id: id
        };
        this.constructor.save(leader);
        this.leaders[id] = leader;
        this.savePlayersId(id);
        return leader;
    }

    newCity(params) {
        const id = this.constructor.computeUUID('city_');
        const city = {
            name: params.name,
            leader: params.leader,
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
            map: {},
            id: id
        };
        this.constructor.save(city);
        this.cities[id] = city;
        return city;
    }

    getPlayerId() {
        return (localStorage.getItem('player'));
    }

    getCityId() {
        return (localStorage.getItem('city'));
    }

    setPlayerId(id) {
        return (localStorage.setItem('player', id||''));
    }

    setCityId(id) {
        return (localStorage.setItem('city', id||''));
    }

    getPlayersId() {
        return this.constructor.load('players')||[];
    }

    savePlayersId(playerId) {
        if(this.players.indexOf(playerId) !== -1) return;
        this.players.push(playerId);
        this.constructor.save('players',this.players);
    }

    saveGame() {
        this.constructor.save(this.currentLeader);
        if(this.currentCity){
            this.constructor.save(this.currentCity);
        }
    }

    static save(model) {
        const modelString = JSON.stringify(model);
        localStorage.setItem(model.id, modelString);
    }

    static load(id) {
        const modelString = localStorage.getItem(id);
        return JSON.parse(modelString);
    }

    static computeUUID(prefix) {
        return prefix + Math.floor((1 + Math.random()) * 0x1000000000).toString(16).substring(1);
    }

}

module.exports = new StateManager();
