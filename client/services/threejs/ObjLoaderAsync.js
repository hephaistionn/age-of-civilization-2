const THREE = require('three');

cacheMesh = {};
meshesTemp = {};

function unstake(meshesTemp, meshRef){
    let meshTemp;
    let meshEnded;
    let parentMesh;
    let parentView;
    while(meshesTemp.length){
        meshTemp = meshesTemp.pop();
        meshEnded = meshRef.clone();
        meshEnded.frustumCulled = meshTemp.frustumCulled;
        meshEnded.matrixAutoUpdate = meshTemp.matrixAutoUpdate;
        meshEnded.castShadow = meshTemp.castShadow;
        meshEnded.userData.model = meshTemp.userData.model;
        meshEnded.matrixWorld =  meshTemp.matrixWorld;
        parentView = meshTemp.userData.parent;
        parentMesh = meshTemp.parent;
        parentMesh.remove(meshTemp);
        parentMesh.add(meshEnded);
        parentView.element = meshEnded;
    }
}

THREE.loadObjAsync = function loadObjAsync(url, material){

    if(cacheMesh[url]){
        const meshRef = cacheMesh[url];
        return meshRef.clone();
    }else{
        if(!meshesTemp[url]){
            THREE.loadObj(url, function(object) {
                cacheMesh[url] = object.children[0];
                unstake(meshesTemp[url],cacheMesh[url]);
            },material);
        }
        meshesTemp[url] = meshesTemp[url]||[];

        const meshTemp = new THREE.Object3D();
        meshTemp.matrixAutoUpdate = false;
        meshTemp.frustumCulled = false;
        meshesTemp[url].push(meshTemp);
        return meshTemp;
    }

};
