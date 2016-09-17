const THREE = require('three');

cacheMesh = {};
meshesTemp = {};

function unstake(meshesTemp, meshRef) {
    let meshTemp;
    let meshEnded;
    let parentMesh;
    let parentView;
    while(meshesTemp.length) {
        meshTemp = meshesTemp.pop();
        meshEnded = meshRef.clone();
        if(meshRef.morphTargetInfluences) {
            meshEnded.morphTargetInfluences = new Float32Array(meshRef.morphTargetInfluences);
        }
        meshEnded.frustumCulled = meshTemp.frustumCulled;
        meshEnded.matrixAutoUpdate = meshTemp.matrixAutoUpdate;
        meshEnded.castShadow = meshTemp.castShadow;
        meshEnded.userData.model = meshTemp.userData.model;
        meshEnded.matrixWorld = meshTemp.matrixWorld;
        parentView = meshTemp.userData.parent;
        parentMesh = meshTemp.parent;
        parentMesh.remove(meshTemp);
        parentMesh.add(meshEnded);
        parentView.element = meshEnded;
    }
}

function computeMesh(buffers, material, indexUV) {

    const geometry = new THREE.BufferGeometry();
    const verticesGroup = buffers.verticesGroup;

    if(verticesGroup.length) { //morph geometry
        geometry.morphAttributes.position = [];
        for(let i = 0; i < verticesGroup.length; i++) {
            geometry.morphAttributes.position.push(verticesGroup[i]);
        }
    }

    const positionBuffer = verticesGroup[0];
    geometry.addAttribute('position', positionBuffer);

    const uvBuffer = buffers.uvsGroup[indexUV];
    geometry.addAttribute('uv', uvBuffer);

    const normalBuffer = buffers.normalsGroup[0];
    geometry.addAttribute('normal', normalBuffer);

    const indexBuffer = buffers.index;
    geometry.setIndex(indexBuffer);

    const mesh = new THREE.Mesh(geometry, material);

    if(verticesGroup.length > 1) {
        mesh.morphTargetInfluences = new Float32Array(verticesGroup.length);
        mesh.morphTargetInfluences[0] = 1;
    }
    return mesh;
}

THREE.getMesh = function getMesh(url, material, indexUV) {

    indexUV = indexUV || 0;

    const id = url + indexUV;

    if(cacheMesh[id]) {
        const meshRef = cacheMesh[id];
        const meshEnded = meshRef.clone();
        if(material)
            meshEnded.material = material;
        if(meshRef.morphTargetInfluences) {
            meshEnded.morphTargetInfluences = new Float32Array(meshRef.morphTargetInfluences);
        }
        return meshEnded;

    } else {
        if(!meshesTemp[id]) {
            THREE.loadBuffers(url, buffers=> {
                cacheMesh[id] = computeMesh(buffers, material, indexUV);
                unstake(meshesTemp[id], cacheMesh[id]);
            });
        }
        meshesTemp[id] = meshesTemp[id] || [];

        const meshTemp = new THREE.Object3D();
        meshTemp.matrixAutoUpdate = false;
        meshTemp.frustumCulled = false;
        meshesTemp[id].push(meshTemp);
        return meshTemp;
    }

};
