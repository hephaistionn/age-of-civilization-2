/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @return {Array<Array<number>>} the path
 */
function backtrace(nodes, index) {

    var path = [
        nodes[index + 1],//y
        nodes[index]//x
    ];

    while(nodes[index + 8]) { //indexOfParent
        index = nodes[index + 8];
        path.push(nodes[index + 1]);
        path.push(nodes[index]);
    }
    return path.reverse();
}
exports.backtrace = backtrace;

/**
 * Compute the length of the path.
 * @param {Array<Array<number>>} path The path
 * @return {number} The length of the path
 */
function pathLength(path) {
    var i, sum = 0, a, b, dx, dy;
    for(i = 1; i < path.length; ++i) {
        a = path[i - 1];
        b = path[i];
        dx = a[0] - b[0];
        dy = a[1] - b[1];
        sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
}
exports.pathLength = pathLength;

/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} The compressed path
 */
function compressPath(path) {

    // nothing to compress
    if(path.length < 3) {
        return path;
    }

    var compressed = [],
        sx = path[0][0], // start x
        sy = path[0][1], // start y
        px = path[1][0], // second point x
        py = path[1][1], // second point y
        dx = px - sx, // direction between the two points
        dy = py - sy, // direction between the two points
        lx, ly,
        ldx, ldy,
        sq, i;

    // normalize the direction
    sq = Math.sqrt(dx * dx + dy * dy);
    dx /= sq;
    dy /= sq;

    // start the new path
    compressed.push([sx, sy]);

    for(i = 2; i < path.length; i++) {

        // store the last point
        lx = px;
        ly = py;

        // store the last direction
        ldx = dx;
        ldy = dy;

        // next point
        px = path[i][0];
        py = path[i][1];

        // next direction
        dx = px - lx;
        dy = py - ly;

        // normalize
        sq = Math.sqrt(dx * dx + dy * dy);
        dx /= sq;
        dy /= sq;

        // if the direction has changed, store the point
        if(dx !== ldx || dy !== ldy) {
            compressed.push([lx, ly]);
        }
    }

    // store the last point
    compressed.push([px, py]);

    return compressed;
}
exports.compressPath = compressPath;
