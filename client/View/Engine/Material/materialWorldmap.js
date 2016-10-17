const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float grounds; \n" +
    "varying vec4 vGrounds; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "void main() { \n" +
    "vGrounds = vec4(0.0); \n" +
    "if(grounds<60.0){ \n" +
    "vGrounds.y = grounds/60.0; \n" +
    "vGrounds.x = 1.0 - vGrounds.y; \n" +
    "} \n" +
    "if(grounds>=60.0 && grounds <120.0){ \n" +
    "vGrounds.z = grounds/60.0 - 1.0; \n" +
    "vGrounds.y = 1.0 - vGrounds.z; \n" +
    "} \n" +
    "if(grounds>=120.0){ \n" +
    "vGrounds.w = grounds/60.0 - 2.0; \n" +
    "vGrounds.z = 1.0 - vGrounds.w; \n" +
    "} \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "vecNormal = (modelMatrix * vec4(normal, 0.0)).xyz; \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";


const fragShader = "" +

    "#if NUM_DIR_LIGHTS > 0 \n" +
    "    struct DirectionalLight { \n" +
    "    vec3 direction; \n" +
    "    vec3 color; \n" +
    "    int shadow; \n" +
    "    float shadowBias; \n" +
    "    float shadowRadius; \n" +
    "    vec2 shadowMapSize; \n" +
    "  }; \n" +
    "  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ]; \n" +
    "#endif \n" +

    "varying vec4 vGrounds; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "uniform sampler2D textureA; \n" +
    "uniform sampler2D textureB; \n" +
    "uniform sampler2D textureC; \n" +
    "uniform sampler2D textureD; \n" +
    "" +
    "uniform vec3 ambientLightColor; \n" +
    "void main(void) { \n" +
    "" +
    "vec2 UV = vec2(vAbsolutePosition.x, vAbsolutePosition.z)/40.0; \n" +
    "vec3 colorA = texture2D( textureA, UV ).xyz; \n" +
    "vec3 colorB = texture2D( textureB, UV ).xyz; \n" +
    "vec3 colorC = texture2D( textureC, UV ).xyz; \n" +
    "vec3 colorD = texture2D( textureD, UV ).xyz; \n" +
    "vec3 colorFinal = vec3(0.0); \n" +
    "colorFinal += colorA * vGrounds.x; \n" +
    "colorFinal += colorB * vGrounds.y; \n" +
    "colorFinal += colorC * vGrounds.z; \n" +
    "colorFinal += colorD * vGrounds.w; \n" +
    "if(vAbsolutePosition.y>12.5){" +
    "colorFinal = mix(vec3(0.90,0.90,0.90), colorFinal, min(-vAbsolutePosition.y+15.0 ,1.0)); \n" +
    "}" +
    "" +
    "vec3 sumLights = vec3(0.0, 0.0, 0.0); \n" +
    "" +
    "DirectionalLight directionalLight;" +
    "for(int i = 0; i < NUM_DIR_LIGHTS; i++) \n" +
    "{ \n" +
    "    directionalLight = directionalLights[ i ]; \n" +
    "    sumLights += dot(directionalLight.direction, vecNormal)* directionalLight.color; \n" +
    "} \n" +
    "sumLights = ambientLightColor + sumLights; \n" +
    "colorFinal *= sumLights; \n" +
    "if(vAbsolutePosition.y<3.0){ \n" +
    "   colorFinal = mix(vec3(0.33,0.7,0.99), colorFinal, vAbsolutePosition.y/3.0); \n" +
    "}" +
    "gl_FragColor = vec4(colorFinal , 1.0); \n" +
    "} ";

const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.textureA = {type: 't', value: THREE.loadTexture("pic/desert_0big.jpg")};
uniforms.textureB = {type: 't', value: THREE.loadTexture("pic/grass_0big.jpg")};
uniforms.textureC = {type: 't', value: THREE.loadTexture("pic/forest_0big.jpg")};
uniforms.textureD = {type: 't', value: THREE.loadTexture("pic/grass_1.jpg")};

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true,
    transparent: false
});

module.exports = mat;
