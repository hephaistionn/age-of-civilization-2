const pathfinding = {
    'Grid': require('./core/Grid'),
    'Util': require('./core/Util'),
    'AStarFinder': require('./finders/AStarFinder')
};

pathfinding.AStarFinder.prototype.findPathBetweenArea = function(source, target, grid) {
    let i, x, y = 0;
    let l = source.length;
    for(i = 0; i < l; i += 2) {
        grid.setWalkableAt(source[i], source[i + 1], 1);
    }
    l = target.length;
    for(i = 0; i < l; i += 2) {
        grid.setWalkableAt(target[i], target[i + 1], 1);
    }

    const sourceX1 = source[0];
    const sourceZ1 = source[1];
    const sourceX2 = source[source.length - 2];
    const sourceZ2 = source[source.length - 1];
    const targetX1 = target[0];
    const targetZ1 = target[1];
    const targetX2 = target[target.length - 2];
    const targetZ2 = target[target.length - 1];

    let path = this.findPath(sourceX1, sourceZ1, targetX1, targetZ1, grid);

    const result = [0];
    result.pop();//optimisation
    l = path.length;
    for(i = 0; i < l; i += 2) {
        x = path[i];
        y = path[i + 1];
        if(x < sourceX1 || x > sourceX2 || y < sourceZ1 || y > sourceZ2) {
            if(x < targetX1 || x > targetX2 || y < targetZ1 || y > targetZ2) {
                result.push(x);
                result.push(y);
                result.push(0);
            }
        }
    }
    l = source.length;
    for(i = 0; i < l; i += 2) {
        grid.setWalkableAt(source[i], source[i + 1], 0);
    }
    l = target.length;
    for(i = 0; i < l; i += 2) {
        grid.setWalkableAt(target[i], target[i + 1], 0);
    }

    return result;
};

module.exports = pathfinding;
