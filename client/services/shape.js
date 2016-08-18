const THREE = require('./threejs');

module.exports = class Shape {

    constructor(path, scaling, height) {
        this.points = [];
        this.segmentsLength = [];
        this.length = 0;
        this.compute(path, scaling, height);
    }

    compute(path, scaling, height) {
        let l = path.length;
        let i = 0;
        let length = 0;
        let point;
        let pointLength;
        let dx = 0;
        let dy = 0;
        let dz = 0;
        var previousPoint;
        this.segmentsLength = new Float32Array(l / 3 - 1);
        for(i = 0; i < l; i += 3) {
            point = new Float32Array(3);
            point[0] = path[i] * scaling + scaling / 2;
            point[1] = path[i + 1] * scaling + scaling / 20;
            point[2] = path[i + 2] * height / 255;
            this.points.push(point);
            pointLength = this.points.length - 2;
            previousPoint = this.points[pointLength];
            if(previousPoint) {
                dx = previousPoint[0] - point[0];
                dz = previousPoint[1] - point[1];
                dy = previousPoint[2] - point[2];
                length += Math.sqrt(dx * dx + dy * dy + dz * dz);
                this.segmentsLength[i / 3 - 1] = length;
            }
        }

        this.length = Math.floor(length*100)/100;
    }

    /**
     * Return point and tangent according to a distance on the path
     * @param distance
     * @returns {*[]} x y tangentX, tangentY
     */
    getPointAndTangent(distance) {

        let index = this.segmentsLength.findIndex(ele => {
            return ele >= distance;
        });

        let c1 = index;
        let c2 = index + 1;

        let pointA = this.points[c1];
        let pointB = this.points[c2];

        let distanceB = this.segmentsLength[index];
        let distanceA = index === 0 ? 0 : this.segmentsLength[index - 1];
        let a = (distance - distanceA) / (distanceB - distanceA);
        let b = 1 - a;

        let x = pointB[0] * a + pointA[0] * b;
        let y = pointB[2] * a + pointA[2] * b;
        let z = pointB[1] * a + pointA[1] * b;

        let length = distanceB - distanceA;
        return [x, y, z, (pointB[0] - pointA[0]) / length, (pointB[2] - pointA[2]) / length];
    }

};
