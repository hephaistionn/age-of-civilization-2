const THREE = require('three');
let canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
let ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.rect(0, 0, 32, 32);
ctx.fillStyle = 'black';
ctx.fill();
const textureLoader = new THREE.TextureLoader();
THREE.loadTexture = function loadTexture(path) {
    const texture = textureLoader.load(path);
    texture.image = canvas;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
};
