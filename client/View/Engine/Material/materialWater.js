const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "varying vec3 vAbsolutePosition; \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";

const fragShader = "" +
    "uniform float time; \n" +
    "uniform float progress; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "uniform sampler2D textureA; \n" +
    "uniform vec3 ambientLightColor; \n" +
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
    "" +
    "void main(void) { \n" +
    "" +
    "vec2 UV1 = vec2(vAbsolutePosition.x, vAbsolutePosition.z+progress)/40.0; \n" +
    "vec2 UV2 = vec2(vAbsolutePosition.x+10.0, vAbsolutePosition.z+10.0+progress)/40.0; \n" +
    "vec3 colorA = texture2D( textureA, UV1 ).xyz; \n" +
    "vec3 colorB = texture2D( textureA, UV2 ).xyz; \n" +
    "vec3 colorFinal = vec3(0.0); \n" +
    "colorFinal += colorA*time; \n" +
    "colorFinal += colorB*(1.0-time); \n" +
    "colorFinal *= vec3(0.5,0.8,1.0); \n" +
    "" +
    "vec3 sumLights = vec3(0.0, 0.0, 0.0); \n" +
    "" +
    "DirectionalLight directionalLight; \n" +

    "    directionalLight = directionalLights[ 0 ]; \n" +
    "    sumLights.rgb += dot(directionalLight.direction, vec3(0.0,1.0,0.0) )* directionalLight.color; \n" +
    "vec3 eyeDirection = normalize(cameraPosition - vAbsolutePosition); \n" +
    "vec3 reflectionDirection  = normalize(vec3(0.5,1.0,0.5)); \n" +
    "float specAngle = max(dot(eyeDirection,reflectionDirection), 0.0); \n" +
    "float specValue = pow(specAngle, 65.0); \n" +
    "sumLights.rgb *= max(specValue*4.0,0.7);" +
    "" +
    "sumLights = ambientLightColor + sumLights; \n" +
    "" +
    "gl_FragColor.xyz = colorFinal * sumLights; \n" +
    "gl_FragColor.a = 0.35; \n" +
    "} ";

const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.textureA = {type: 't', value: THREE.loadTexture('pic/water_1.jpg')};
uniforms.time = { type: 'f', value: 0.0 };
uniforms.progress = { type: 'f', value: 0.0 };
uniforms.cameraPosition  = { type: 'v3', value: new THREE.Vector3(1.0,0.0,0.0) };

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true,
    transparent: true
});

module.exports = mat;
