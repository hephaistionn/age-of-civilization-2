const City = require('../City');

module.exports = Worldmap=> {

    Worldmap.prototype.updateStateCities = function updateStateCities(model) {
        const citiesView = this.cities;
        const citiesModel = model.cities;

        let lengthModel = citiesModel.length;
        for(let i = 0; i < lengthModel; i++) {

            let cityView = citiesView[i];
            let cityModel = citiesModel[i];

            if(!cityView) {
                let newCityView = new City(cityModel);
                citiesView[i] = newCityView;
                this.waterMesh.add(newCityView.element);
                //waterMesh is used because water surface is used for check click collision

            } else if(cityView.model !== cityModel) {
                citiesView.splice(i, 1);
                cityView.waterMesh.parent.remove(cityView.element);
                i--;
            }
        }

        let lengthView = citiesView.length;
        if(lengthView > lengthModel) {
            for(let i = lengthModel; i < lengthView; i++) {
                cityView = citiesView[i];
                cityView.waterMesh.parent.remove(cityView.element);
            }
            citiesView.splice(lengthModel, lengthView);
        }
    };

    Worldmap.prototype.updateStateOfOneCities = function updateStateOfOneCities(cityIndex) {
        this.cities[cityIndex].updateState();
    };
};
