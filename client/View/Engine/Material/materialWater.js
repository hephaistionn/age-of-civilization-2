const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float revealed; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying float vRevealed; \n"+
    "void main() { \n" +
    "vec3 positionPlan = vec3(position.x,.0,position.z); \n" +
    "vec4 worldPosition = modelMatrix * vec4(positionPlan, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "vRevealed = revealed; \n"+
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";

const fragShader = "" +
    "uniform float time; \n" +
    "uniform float opacity; \n" +
    "uniform float progress; \n" +
    "uniform float size; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying float vRevealed; \n"+
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
    "float offset = size/4.0;  \n" +
    "vec2 UV1 = vec2(vAbsolutePosition.x, vAbsolutePosition.z+progress)/size; \n" +
    "vec2 UV2 = vec2(vAbsolutePosition.x+offset, vAbsolutePosition.z+offset+progress)/size; \n" +
    "vec3 colorA = texture2D( textureA, UV1 ).xyz; \n" +
    "vec3 colorB = texture2D( textureA, UV2 ).xyz; \n" +
    "vec3 colorFinal = vec3(0.0); \n" +
    "colorFinal += colorA*time; \n" +
    "colorFinal += colorB*(1.0-time); \n" +
    "colorFinal *= vec3(0.40,0.80,0.99); \n" +
   // "colorFinal *= vec3(0.40,0.60,0.99); \n" +
    "" +
    "vec3 sumLights = vec3(0.0, 0.0, 0.0); \n" +
    "" +
    "DirectionalLight directionalLight; \n" +

    "    directionalLight = directionalLights[ 0 ]; \n" +
    "    sumLights.rgb += dot(directionalLight.direction, vec3(0.0,1.0,0.0) )* directionalLight.color; \n" +
    "vec3 eyeDirection = normalize(cameraPosition - vAbsolutePosition); \n" +
    "vec3 reflection = normalize(vec3(0.1,0.8,0.5));"+
    "float s = max(1.0-abs(eyeDirection.x-reflection.x)*1.4,0.01);\n" +

    "float direction = max(0.0, dot(eyeDirection, reflection));\n"+
    "vec3 specularColor = pow(direction, 100.0)*vec3(0.9,0.9,0.9)*0.9*s;\n"+
    "sumLights.rgb += specularColor;\n"+

    "reflection = normalize(vec3(0.1,0.8,0.8));"+
    "direction = max(0.0, dot(eyeDirection, reflection));\n"+
    "specularColor = pow(direction, 100.0)*vec3(0.9,0.9,0.9)*0.7*s;\n"+
    "sumLights.rgb += specularColor;\n"+

    "" +
    "sumLights = ambientLightColor + sumLights; \n" +
    "" +
    "gl_FragColor.xyz = colorFinal * sumLights; \n" +
    "gl_FragColor.a = vRevealed; \n" +
    "} ";

const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.textureA = {type: 't', value: THREE.loadTexture('pic/water_1.jpg')};
uniforms.time = { type: 'f', value: 0.0 };
uniforms.progress = { type: 'f', value: 0.0 };
uniforms.opacity = { type: 'f', value: 0.35 };
uniforms.size = { type: 'f', value: 40.0 };
uniforms.cameraPosition  = { type: 'v3', value: new THREE.Vector3(1.0,0.0,0.0) };
uniforms.blending = THREE.AddOperation;
uniforms.blendSrc = THREE.AddOperation;
uniforms.blendDst= THREE.AddOperation;
uniforms.blendEquation = THREE.AddOperation;

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true,
    transparent: true
});

module.exports = mat;
