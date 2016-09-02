const THREE = require('three');
const material = new THREE.MeshPhongMaterial({map: THREE.loadTexture('pic/unity.png'), morphTargets: true});
module.exports = material;