const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float walkable; \n" +
    "varying float vColor; \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "vColor = walkable; \n" +
    "} ";


const fragShader = "" +
    "varying float vColor; \n" +
    "" +
    "void main(void) { \n" +
    "vec3 colorFinal = vec3(0.0,0.0,1.0);" +
    "if(vColor<1.0){ \n" +
    "   colorFinal = vec3(1.0,0.0,0.0); \n" +
    "} \n" +
    "" +
    "gl_FragColor = vec4(colorFinal,0.5); \n" +
    "} ";

const mat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: false,
    transparent: true
});

module.exports = mat;
