const pathfinding = {
    'Node': require('../../node_modules/pathfinding/src/core/Node'),
    'Grid': require('../../node_modules/pathfinding/src/core/Grid'),
    'Util': require('../../node_modules/pathfinding/src/core/Util'),
    'DiagonalMovement': require('../../node_modules/pathfinding/src/core/DiagonalMovement'),
    'Heuristic': require('../../node_modules/pathfinding/src/core/Heuristic'),
    'AStarFinder': require('../../node_modules/pathfinding/src/finders/AStarFinder')
};

pathfinding.AStarFinder.prototype.findPathBetweenArea = function(source, target, grid) {
    let i = 0;
    let l = source.length;
    for(i=0;i<l;i+=2){
        grid.setWalkableAt(source[i], source[i+1], true);
    }
    l = target.length;
    for(i=0;i<l;i+=2){
        grid.setWalkableAt(target[i], target[i+1], true);
    }

    const sourceX1 = source[0];
    const sourceZ1 = source[1];
    const sourceX2 = source[source.length-2];
    const sourceZ2 = source[source.length-1];
    const targetX1 = target[0];
    const targetZ1 = target[1];
    const targetX2 = target[target.length-2];
    const targetZ2 = target[target.length-1];

    let path = this.findPath(sourceX1, sourceZ1, targetX1, targetZ1, grid);

    const result = [];
    l = path.length;
    for(i=0;i<l;i++){
        let node = path[i];
        let x = node[0];
        let y = node[1];
        if(x<sourceX1||x>sourceX2||y<sourceZ1||y>sourceZ2){
            if(x<targetX1||x>targetX2||y<targetZ1||y>targetZ2){
                result.push(node)
            }
        }
    }

    return result;
};

module.exports = pathfinding;
