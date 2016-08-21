const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying vec2 vUv; \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "vUv = uv; \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";


const fragShader = "" +

    "varying vec2 vUv; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "uniform sampler2D textureLayout; \n" +
    "uniform sampler2D textureA; \n" +
    "" +
    "void main(void) { \n" +
    "" +
    "vec2 UVT = vec2(vAbsolutePosition.x, vAbsolutePosition.z)/10.0; \n" +
    "vec3 filter = texture2D( textureLayout, vUv ).xyz; \n" +
    "vec3 colorA = texture2D( textureA, UVT ).xyz; \n" +
    "vec3 colorFinal = vec3(0.0); \n" +
    "colorFinal += colorA; \n" +
    "" +
    "gl_FragColor = vec4(colorFinal , filter.x); \n" +
    "} ";

let canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
let ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.rect(0, 0, 512, 512);
ctx.fillStyle = 'black';
ctx.fill();

const textureLoader = new THREE.TextureLoader();
function loadTexture(path) {
    const texture = textureLoader.load(path);
    texture.image = canvas;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
}

const uniforms = THREE.UniformsUtils.merge([
]);

uniforms.textureA = {type: 't', value: loadTexture("pic/tile_0.jpg")};
uniforms.textureLayout = {type: 't', value: loadTexture("pic/path_opacity_2.png")};

uniforms.textureLayout.value.flipY = false;
//uniforms.textureLayout.value.magFilter = THREE.NearestMipMapNearestFilter;
uniforms.textureLayout.value.minFilter = THREE.NearestFilter;
uniforms.textureLayout.value.repeat = false;
uniforms.textureLayout.value.generateMipmaps = false;


const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: false,
    transparent: true
});

module.exports = mat;
