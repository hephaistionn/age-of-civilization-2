const THREE = require('../../../services/threejs');

module.exports = (Component, pathObj)=> {

    Component.ready = function() {
    };

    THREE.loadObj(pathObj, function(object) {
        Component.referenceMesh = object.children[0];
        Component.ready();
    }, new THREE.MeshPhongMaterial({color: 0x888888}));
};
