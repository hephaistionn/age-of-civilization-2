const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float grounds; \n" +
    "attribute float revealed; \n" +
    "varying vec4 vGrounds; \n" +
    "varying vec3 vecNormal; \n" +
    "varying float vRevealed; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "#ifdef USE_SHADOWMAP \n" +
    "	#if NUM_DIR_LIGHTS > 0 \n" +
    "		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ]; \n" +
    "		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ]; \n" +
    "	#endif \n" +
    "#endif \n" +
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
    "vRevealed = revealed; \n" +
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
    "    if ( inFrustum ) { \n" +
    "        return max(texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ),0.5); \n" +
    "    } \n" +
    "    return 1.0; \n" +
    "} \n" +
    "#endif      \n" +


    "varying vec4 vGrounds; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying float vRevealed; \n" +
    "uniform sampler2D textureA; \n" +
    "uniform sampler2D textureB; \n" +
    "uniform sampler2D textureC; \n" +
    "uniform sampler2D textureD; \n" +
    "" +
    "uniform vec3 ambientLightColor; \n" +
    "void main(void) { \n" +
    "   if(vRevealed > 0.1) {" +
    "       vec2 UV = vec2(vAbsolutePosition.x, vAbsolutePosition.z)/40.0; \n" +
    "       vec3 colorA = texture2D( textureA, UV ).xyz; \n" +
    "       vec3 colorB = texture2D( textureB, UV ).xyz; \n" +
    "       vec3 colorC = texture2D( textureC, UV ).xyz; \n" +
    "       vec3 colorD = texture2D( textureD, UV ).xyz; \n" +
    "       vec3 colorFinal = vec3(0.0); \n" +
    "       colorFinal += colorA * vGrounds.x; \n" +
    "       colorFinal += colorB * vGrounds.y; \n" +
    "       colorFinal += colorC * vGrounds.z; \n" +
    "       colorFinal += colorD * vGrounds.w; \n" +
    "       vec3 sumLights = vec3(0.0, 0.0, 0.0); \n" +
    "       DirectionalLight directionalLight;" +
    "       for(int i = 0; i < NUM_DIR_LIGHTS; i++) {\n" +
    "           directionalLight = directionalLights[ i ]; \n" +
    "           sumLights += dot(directionalLight.direction, vecNormal)* directionalLight.color; \n" +
    "           #ifdef USE_SHADOWMAP \n" +
    "               float shadowFactor = bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0; \n" +
    "               sumLights *= shadowFactor; \n" +
    "           #endif \n" +
    "       } \n" +
    "       sumLights = ambientLightColor + sumLights; \n" +
    "       colorFinal *= sumLights; \n" +
    "       if(vAbsolutePosition.y<3.0){ \n" +
    "           colorFinal = mix(vec3(0.2,0.6,0.7), colorFinal, vAbsolutePosition.y/3.0); \n" +
    "       }" +
    "       gl_FragColor = vec4(colorFinal , 1.0); \n" +
    "   } else {" +
    "       gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); \n" +
    "   }" +
    "}";

const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.textureA = {type: 't', value: THREE.loadTexture("pic/rock_0.jpg")};
uniforms.textureB = {type: 't', value: THREE.loadTexture("pic/grass_0.jpg")};
uniforms.textureC = {type: 't', value: THREE.loadTexture("pic/grass_1.jpg")};
uniforms.textureD = {type: 't', value: THREE.loadTexture("pic/soil_0.jpg")};

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true,
    transparent: false
});

module.exports = mat;
