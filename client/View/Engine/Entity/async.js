const THREE = require('../../../services/threejs');

const material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('pic/textureB.png')});

module.exports.obj = (Component, pathObj)=> {

    Component.ready = function() {
    };

    THREE.loadObj(pathObj, function(object) {
        Component.referenceMesh = object.children[0];
        Component.ready();
    },material);
};


module.exports.attributes = (Component, pathAttributes)=> {

    Component.ready = function() {
    };

    THREE.loadAttributes(pathAttributes, function(object) {
        Component.referenceAttributes = object;
        Component.ready();
    });
};
