const pathfinding = {
    'Node': require('../../node_modules/pathfinding/src/core/Node'),
    'Grid': require('../../node_modules/pathfinding/src/core/Grid'),
    'Util': require('../../node_modules/pathfinding/src/core/Util'),
    'DiagonalMovement': require('../../node_modules/pathfinding/src/core/DiagonalMovement'),
    'Heuristic': require('../../node_modules/pathfinding/src/core/Heuristic'),
    'AStarFinder': require('../../node_modules/pathfinding/src/finders/AStarFinder')
};

pathfinding.AStarFinder.prototype.findPathBetweenArea = function(startX, startY, startWidth, startHeight, endX, endY, endWidth, endHeight, grid) {
    let x;
    let y;

    for(x = startX; x < startX + startWidth; x++) {
        for(y = startY; y < startY + startHeight; y++) {
            grid.setWalkableAt(x, y, true);
        }
    }

    for(x = endX; x < endX + endWidth; x++) {
        for(y = endY; y < endY + endHeight; y++) {
            grid.setWalkableAt(x, y, true);
        }
    }

    let path = this.findPath(startX, startY, endX, endY, grid);

    const result = [];
    let node;
    startWidth = startWidth - 1;
    startHeight = startHeight - 1;
    endWidth = endWidth - 1;
    endHeight = endHeight - 1;
    const length = path.length;
    for(i = 0; i < length; i++) {
        node = path[i];
        x = node[0];
        y = node[1];
        if(x < startX || x > startX + startWidth || y < startY || y > startY + startHeight) {
            if(x < endX || x > endX + endWidth || y < endY || y > endY + endHeight) {
                result.push(node)
            }
        }
    }

    return result;
};

module.exports = pathfinding;
