const THREE = require('../../services/threejs');

const vertShader = "" +
    "attribute float grounds; \n" +
    "varying vec4 vGrounds; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec2 vAbsolutePosition; \n" +
    "#ifdef USE_SHADOWMAP \n" +
    "	#if NUM_DIR_LIGHTS > 0 \n" +
    "		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ]; \n" +
    "		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ]; \n" +
    "	#endif \n" +
    "#endif \n" +
    "void main() { \n" +
    "vGrounds = vec4(0.0); \n" +
    "if(grounds<0.33){ \n" +
    "vGrounds.x = -3.0 * grounds + 1.0; \n" +
    "vGrounds.y = 3.0 * grounds; \n" +
    "} \n" +
    "if(grounds>=0.33 && grounds <0.66){ \n" +
    "vGrounds.y = -3.0 * grounds + 2.0; \n" +
    "vGrounds.z = 3.0 * grounds - 1.0; \n" +
    "} \n" +
    "if(grounds>=0.66){ \n" +
    "vGrounds.z = -3.0 * grounds + 3.0; \n" +
    "vGrounds.w = 3.0 * grounds - 2.0; \n" +
    "} \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = vec2(worldPosition.x, worldPosition.z); \n" +
    "vecNormal = (modelMatrix * vec4(normal, 0.0)).xyz; \n" +
    "#ifdef USE_SHADOWMAP \n" +
    "	#if NUM_DIR_LIGHTS > 0 \n" +
    "	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n " +
    "		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition; \n" +
    "	}\n " +
    "	#endif \n" +
    "#endif \n" +
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

    "#ifdef USE_SHADOWMAP \n" +
    "#if NUM_DIR_LIGHTS > 0 \n" +
    "   uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ]; \n" +
    "varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ]; \n" +
    "#endif \n" +
    "float unpackDepth( const in vec4 rgba_depth ) { \n" +
    "    const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 ); \n" +
    "    return dot( rgba_depth, bit_shift ); \n" +
    "} \n" +
    "float texture2DCompare( sampler2D depths, vec2 uv, float compare ) { \n" +
    "    return step( compare, unpackDepth( texture2D( depths, uv ) ) ); \n" +
    "} \n" +
    "float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) { \n" +
    "    shadowCoord.xyz /= shadowCoord.w; \n" +
    "    shadowCoord.z += shadowBias; \n" +
    "    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 ); \n" +
    "    bool inFrustum = all( inFrustumVec ); \n" +
    "    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 ); \n" +
    "    bool frustumTest = all( frustumTestVec ); \n" +
    "    if ( frustumTest ) { \n" +
    "        return max(texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ),0.5); \n" +
    "    } \n" +
    "    return 0.5; \n" +
    "} \n" +
    "#endif      \n" +


    "varying vec4 vGrounds; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec2 vAbsolutePosition; \n" +
    "uniform sampler2D textureA; \n" +
    "uniform sampler2D textureB; \n" +
    "uniform sampler2D textureC; \n" +
    "uniform sampler2D textureD; \n" +
    "" +
    "uniform vec3 ambientLightColor; \n" +
    "void main(void) { \n" +
    "" +
    "vec3 colorA = texture2D( textureA, vAbsolutePosition/40.0 ).xyz; \n" +
    "vec3 colorB = texture2D( textureB, vAbsolutePosition/40.0 ).xyz; \n" +
    "vec3 colorC = texture2D( textureC, vAbsolutePosition/40.0 ).xyz; \n" +
    "vec3 colorD = texture2D( textureD, vAbsolutePosition/40.0 ).xyz; \n" +
    "vec3 colorFinal = vec3(0.0); \n" +
    "colorFinal += colorA * vGrounds.x; \n" +
    "colorFinal += colorB * vGrounds.y; \n" +
    "colorFinal += colorC * vGrounds.z; \n" +
    "colorFinal += colorD * vGrounds.w; \n" +
    "" +
    "vec4 sumLights = vec4(0.0, 0.0, 0.0, 1.0); \n" +
    "" +
    "DirectionalLight directionalLight;" +
    "for(int i = 0; i < NUM_DIR_LIGHTS; i++) \n" +
    "{ \n" +
    "    directionalLight = directionalLights[ i ]; \n" +
    "    sumLights.rgb += dot(directionalLight.direction, vecNormal)* directionalLight.color; \n" +
    "    #ifdef USE_SHADOWMAP \n" +
    "    sumLights.rgb *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0; \n" +
    "    #endif \n" +
    "} \n" +
    "" +
    "sumLights = vec4(ambientLightColor, 1.0) + sumLights; \n" +
    "" +
    "gl_FragColor = vec4(colorFinal , 1.0)*sumLights; \n" +
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
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.textureA = {type: 't', value: loadTexture("pic/grass_0.jpg")};
uniforms.textureB = {type: 't', value: loadTexture("pic/grass_1.jpg")};
uniforms.textureC = {type: 't', value: loadTexture("pic/soil_0.jpg")};
uniforms.textureD = {type: 't', value: loadTexture("pic/soil_1.jpg")};

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true,
    depthTest: false,
    transparent: false
});

module.exports = mat;
