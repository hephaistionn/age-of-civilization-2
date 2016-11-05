module.exports = StateManager => {

    const IMPORT = 2;
    const EXPORT = 1;
    const CLOSE = 0;

    StateManager.prototype.newCity = function newCity(params) {
        const id = this.computeUUID('city_');
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
            camera: {x: 25, z: 25},
            map: {

            },
            id: id
        };
        this.save(city);
        this.cities[id] = city;
        this.setWorldmapCity(id);
        return city;
    };

    StateManager.prototype.getCity = function getCity(id) {
        if(this.cities[id]) {
            return this.cities[id];
        } else {
            const city = this.load(id);
            if(city) {
                this.cities[id] = city;
                return city;
            } else {
                throw 'No City with id ' + id;
            }
        }
    };

    StateManager.prototype.loadCurrentCity = function loadCurrentCity(id) {
        if(!id) {
            id = this.load('currentCityId');
        } else {
            this.save(id, 'currentCityId');
        }
        if(id) {
            this.currentCity = this.getCity(id);
            return this.currentCity;
        }
    };

    StateManager.prototype.updateStone = function updateStone(value) {
        this.currentCity.resources.stone += value;
    };

    StateManager.prototype.updateWood = function updateWood(value) {
        this.currentCity.resources.wood += value;
    };

    StateManager.prototype.updateMeat = function updateMeat(value) {
        this.currentCity.resources.meat += value;
    };

    StateManager.prototype.updatePopulation = function updatePopulation(value) {
        this.currentCity.population += value;
    };

    StateManager.prototype.updateWorkers = function updateWorkers(value) {
        this.currentCity.workers += value;
    };

    StateManager.prototype.updateTrade = function updateTrade(id) {
        const trade = this.currentCity.trade;
        if(trade[id] === CLOSE) {
            trade[id] = EXPORT;
        } else if(this.trade[id] === EXPORT) {
            trade[id] = IMPORT;
        } else if(this.trade[id] === IMPORT) {
            trade[id] = CLOSE;
        }
    };


};
