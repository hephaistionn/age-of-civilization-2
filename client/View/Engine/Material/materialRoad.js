const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float type; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying vec2 vUv; \n" +
    "varying vec3 vecNormal; \n" +
    "varying float vType; \n" +
    "#ifdef USE_SHADOWMAP \n" +
    "	#if NUM_DIR_LIGHTS > 0 \n" +
    "		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ]; \n" +
    "		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ]; \n" +
    "	#endif \n" +
    "#endif \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "vecNormal = (modelMatrix * vec4(normal, 0.0)).xyz; \n" +
    "#ifdef USE_SHADOWMAP \n" +
    "	#if NUM_DIR_LIGHTS > 0 \n" +
    "	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n " +
    "		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition; \n" +
    "	}\n " +
    "	#endif \n" +
    "#endif \n" +
    "vUv = uv; \n" +
    "vType = type; \n" +
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
    "    return 1.0; \n" +
    "} \n" +
    "#endif      \n" +

    "varying vec2 vUv; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying float vType; \n" +
    "uniform sampler2D textureLayout; \n" +
    "uniform sampler2D textureA; \n" +
    "uniform sampler2D textureB; \n" +
    "uniform vec3 ambientLightColor; \n" +
    "" +
    "void main(void) { \n" +
    "" +
    "vec2 UVT = vec2(vAbsolutePosition.x, vAbsolutePosition.z)/10.0; \n" +
    "vec3 filter = texture2D( textureLayout, vUv ).xyz; \n" +
    "vec3 colorFinal = texture2D( textureA, UVT ).xyz; \n" +
    " if(vType>2.5){ \n"+
    "   colorFinal = texture2D( textureB, UVT ).xyz; \n" +
    "}" +
    "vec3 sumLights = vec3(0.0, 0.0, 0.0); \n" +
    "" +
    "DirectionalLight directionalLight;" +
    "for(int i = 0; i < NUM_DIR_LIGHTS; i++) \n" +
    "{ \n" +
    "    directionalLight = directionalLights[ i ]; \n" +
    "    sumLights += dot(directionalLight.direction, vecNormal)* directionalLight.color; \n" +
    "    #ifdef USE_SHADOWMAP \n" +
    "    float shadowFactor = bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0; \n" +
    "    sumLights *= shadowFactor; \n" +
    "    #endif \n" +
    "} \n" +
    "" +
    "sumLights = ambientLightColor + sumLights; \n" +
    "" +
    "gl_FragColor = vec4(colorFinal * sumLights , filter.x); \n" +
    "} ";

const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.textureA = {type: 't', value: THREE.loadTexture("pic/tile_0.jpg")};
uniforms.textureB = {type: 't', value: THREE.loadTexture("pic/soil_1.jpg")};
uniforms.textureLayout = {type: 't', value: THREE.loadTexture("pic/path_opacity_2.png")};
uniforms.textureLayout.value.flipY = false;
uniforms.textureLayout.value.minFilter = THREE.NearestFilter;
uniforms.textureLayout.value.repeat = false;
uniforms.textureLayout.value.generateMipmaps = false;

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true,
    transparent: true
});

module.exports = mat;
