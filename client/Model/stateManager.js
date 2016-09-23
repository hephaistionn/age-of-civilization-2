class StateManager {

    constructor() {

        this.IMPORT = 2;
        this.EXPORT = 1;
        this.CLOSE = 0;

        this.resources = {
            wood: 1000,
            stone: 1000,
            meat: 400
        };

        this.population = 0;

        this.trade = {
            wood: this.CLOSE,
            stone: this.CLOSE,
            meat: this.CLOSE
        }
    }

    updateWood(value){
        this.resources.wood += value;
    }

    switchTrade(id) {
        if(this.trade[id] === this.CLOSE){
            this.trade[id] = this.EXPORT;
        }else if(this.trade[id] === this.EXPORT){
            this.trade[id] = this.IMPORT;
        }else if(this.trade[id] === this.IMPORT){
            this.trade[id] = this.CLOSE;
        }
    }
}

module.exports = new StateManager();
