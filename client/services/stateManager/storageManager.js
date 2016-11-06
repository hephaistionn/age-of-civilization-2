module.exports = StateManager => {

    const isString = 'string';
    const isObject = /\[|\{/;

    StateManager.prototype.save = function save(model, id) {
        if(typeof model === isString) {
            localStorage.setItem(id, model);
        } else {
            const modelString = JSON.stringify(model);
            localStorage.setItem(model.id || id, modelString);
        }
    };

    StateManager.prototype.load = function load(id) {
        const modelString = localStorage.getItem(id);
        if(modelString === null) {
            return null;
        } else if(isObject.test(modelString)) {
            return JSON.parse(modelString);
        } else {
            return modelString;
        }
    };

    StateManager.prototype.computeUUID = function computeUUID(prefix) {
        return prefix + Math.floor((1 + Math.random()) * 0x1000000000).toString(16).substring(1);
    };

};
