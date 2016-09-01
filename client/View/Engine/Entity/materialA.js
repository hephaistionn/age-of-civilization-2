const THREE = require('three');
const material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('pic/textureB.png')});
module.exports = material;