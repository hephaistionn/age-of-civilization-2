const THREE = require('./threejs');

module.exports = class Shape{

    constructor(path,scaling, height) {
        this.points = [];
        this.segmentsLength = [];
        this.length = 0;
        this.compute(path,scaling, height);
    }

    compute(path, scaling, height) {
        let l = path.length;
        let i = 0;
        let length = 0;
        let point;
        for(i=0 ; i<l ; i++ ) {
            point = new THREE.Vector3(path[i][0]*scaling+scaling/2,path[i][1]*scaling+scaling/2,path[i][2]*height);
            this.points.push(point);
            if(this.points[i-1]){
                length += this.points[i-1].distanceTo(point);
                this.segmentsLength.push(length);
            }
        }

        this.length = length;
    }

    /**
     * Return point according to a distance on the path
     * @param distance
     * @returns {*[]} x y
     */
    getPoint(distance) {

        let index = this.segmentsLength.findIndex(ele => {
            return ele>=distance;
        });

        let c1 = index;
        let c2 = index+1;

        let pointA = this.points[ c1 ];
        let pointB = this.points[ c2 ];

        let distanceB = this.segmentsLength[index];
        let distanceA = index === 0 ? 0 : this.segmentsLength[index-1];
        let a = (distance-distanceA)/(distanceB-distanceA);
        let b = 1-a;

        let x = pointB.x * a + pointA.x * b;
        let y = pointB.y * a + pointA.y * b;
        let z = pointB.z * a + pointA.z * b;

        return [x, y, z];
    }

    /**
     * Return point and tangent according to a distance on the path
     * @param distance
     * @returns {*[]} x y tangentX, tangentY
     */
    getPointAndTangent(distance) {

        let index = this.segmentsLength.findIndex(ele => {
            return ele>=distance;
        });

        let c1 = index;
        let c2 = index+1;

        let pointA = this.points[ c1 ];
        let pointB = this.points[ c2 ];

        let distanceB = this.segmentsLength[index];
        let distanceA = index === 0 ? 0 : this.segmentsLength[index-1];
        let a = (distance-distanceA)/(distanceB-distanceA);
        let b = 1-a;

        let x = pointB.x * a + pointA.x * b;
        let y = pointB.y * a + pointA.y * b;
        let z = pointB.z * a + pointA.z * b;

        let length = distanceB-distanceA;

        return [x, y, z, (pointB.x - pointA.x)/length, (pointB.y - pointA.y)/length ];
    }

};
