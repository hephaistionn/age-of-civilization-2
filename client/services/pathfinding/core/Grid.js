var DiagonalMovement = require('./DiagonalMovement');


function Grid(width, height, initValue) {
    /**
     * The number of columns of the grid.
     * @type number
     */
    this.width = width;
    /**
     * The number of rows of the grid.
     * @type number
     */
    this.height = height;

    /**x, y, walkable, opened, closed, f, g, h, parent
     * @type {number}
     */
    this.sizeNode = 9;
    this.indexX = 0;
    this.indexY = 1;
    this.indexWalkable = 2;
    this.indexOpended = 3;
    this.indexClosed = 4;
    this.indexF = 5;
    this.indexG = 6;
    this.indexH = 7;
    this.indexParent = 8;

    /**
     * A 2D array of nodes.
     */
    this.nodes = this._buildNodes(width, height, initValue);
}


Grid.prototype._buildNodes = function _buildNodes(width, height, initValue) {

    initValue = parseInt(initValue, 10);
    const sizeNode = this.sizeNode;

    const size = width * height;

    const nodes = new Uint16Array(size * sizeNode);

    var y, x, index;

    for(y = 0; y < height; ++y) {
        for(x = 0; x < width; ++x) {
            index = (y * width + x) * sizeNode;
            nodes[index] = x;
            nodes[index + 1] = y;
            nodes[index + 2] = initValue;
        }
    }

    return nodes;
};


Grid.prototype.getIndexNodeAt = function getIndexNodeAt(x, y) {
    return (y * this.width + x) * this.sizeNode;
};


/**
 * Determine whether the node at the given position is walkable.
 * (Also returns false if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {number} - The walkability of the node.
 */
Grid.prototype.isWalkableAt = function isWalkableAt(x, y) {
    if((x >= 0 && x < this.width) && (y >= 0 && y < this.height)) {
        return this.nodes[(y * this.width + x) * this.sizeNode + this.indexWalkable];
    }
};

/**
 * Set whether the node on the given position is walkable.
 * NOTE: throws exception if the coordinate is not inside the grid.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {number} walkable - Whether the position is walkable.
 */
Grid.prototype.setWalkableAt = function setWalkableAt(x, y, walkable) {
    this.nodes[(y * this.width + x) * this.sizeNode + this.indexWalkable] = walkable;
};


/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */
Grid.prototype.getNeighbors = function getNeighbors(nodeIndex, diagonalMovement) {
    const nodes = this.nodes;
    var x = nodes[nodeIndex + this.indexX],
        y = nodes[nodeIndex + this.indexY],
        s0 = false, d0 = false,
        s1 = false, d1 = false,
        s2 = false, d2 = false,
        s3 = false, d3 = false,
        tx = x, ty = y - 1;

    const neighbors = [0]; //opitimization integer array
    neighbors.pop();

    // ↑
    if(this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
        s0 = true;
    }
    // →
    tx = x + 1;
    ty = y;
    if(this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
        s1 = true;
    }
    // ↓
    tx = x;
    ty = y + 1;
    if(this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
        s2 = true;
    }
    // ←
    tx = x - 1;
    ty = y;
    if(this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
        s3 = true;
    }

    if(diagonalMovement === DiagonalMovement.Never) {
        return neighbors;
    }

    if(diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s2 && s3;
    } else if(diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s2 || s3;
    } else if(diagonalMovement === DiagonalMovement.Always) {
        d0 = true;
        d1 = true;
        d2 = true;
        d3 = true;
    } else {
        throw new Error('Incorrect value of diagonalMovement');
    }

    // ↖
    tx = x - 1;
    ty = y - 1;
    if(d0 && this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
    }
    // ↗
    tx = x + 1;
    ty = y - 1;
    if(d1 && this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
    }
    // ↘
    tx = x + 1;
    ty = y + 1;
    if(d2 && this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
    }
    // ↙
    tx = x - 1;
    ty = y + 1;
    if(d3 && this.isWalkableAt(tx, ty)) {
        neighbors.push((ty * this.width + tx) * this.sizeNode);
    }

    return neighbors;
};


/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */
Grid.prototype.clone = function clone() {
    const newGrid = new Grid(0, 0);
    newGrid.nodes = new Uint16Array(this.nodes);
    newGrid.width = this.width;
    newGrid.height = this.height;
    return newGrid;
};

/**
 * clear grid after pathfinding.
 */
Grid.prototype.clear = function clear() {
    let i;
    const nodes = this.nodes;
    const size = nodes.length;
    const sizeNode = this.sizeNode;
    const indexOpended = this.indexOpended;
    const indexClosed = this.indexClosed;
    const indexF = this.indexF;
    const indexG = this.indexG;
    const indexH = this.indexH;
    const indexParent = this.indexParent

    for(i = 0; i < size; i += sizeNode) {
        nodes[i + indexOpended] = 0;
        nodes[i + indexClosed] = 0;
        nodes[i + indexF] = 0;
        nodes[i + indexG] = 0;
        nodes[i + indexH] = 0;
        nodes[i + indexParent] = 0;
    }

};

module.exports = Grid;
