class Node {
    constructor(x, y, is_pass) {
        this.x = x;
        this.y = y;
        this.is_pass = is_pass;
        this.count = 0;
        this.is_used = 0;
    }

    isEqual(node) {
        return this.x === node.x && this.y === node.y;
    }

    setPass(is_pass) {
        this.is_pass = is_pass;
    }

    static buildMaze(xLength, yLength, ...rest) {
        const maze = [];
        for (let i = 0; i < xLength; i++) {
            for (let j = 0; j < yLength; j++) {
                const node = new Node(j, i, true);
                for (let k = 0; k < rest.length; k++) {
                    if (rest[k].isEqual(node)) {
                        node.setPass(false);
                        break;
                    }
                }
                maze.push(node);
            }
        }
        return maze;
    }

    static getNodeInMaze(maze, x, y) {
        const node = new Node(x, y);
        return maze.find(item=>item.isEqual(node)) || {};
    }
}

const maze = Node.buildMaze(6, 6, new Node(1, 0), new Node(0, 4), new Node(3, 1), new Node(2, 2), new Node(4, 2), new Node(1, 3), new Node(4, 3), new Node(2, 4));

function goToMaze(maze, origin, target) {
    const queue = [origin];
    const results = [];
    while (queue.length) {
        const current = queue.shift();
        results.push(current);
        current.is_used = 1;
        if (current.isEqual(target)) {
            break;
        }
        if (current) {
            const top = Node.getNodeInMaze(maze, current.x, current.y + 1);
            const bottom = Node.getNodeInMaze(maze, current.x, current.y - 1);
            const left = Node.getNodeInMaze(maze, current.x - 1, current.y);
            const right = Node.getNodeInMaze(maze, current.x + 1, current.y);
            if (top.is_pass && !top.is_used) {
                top.count = 1 + current.count;
                top.is_used = 1;
                top.prev = {x: current.x, y: current.y};
                queue.push(top);
            }
            if (bottom.is_pass && !bottom.is_used) {
                bottom.count = 1 + current.count;
                bottom.is_used = 1;
                bottom.prev = {x: current.x, y: current.y};
                queue.push(bottom);
            }
            if (left.is_pass && !left.is_used) {
                left.count = 1 + current.count;
                left.is_used = 1;
                left.prev = {x: current.x, y: current.y};
                queue.push(left);
            }
            if (right.is_pass && !right.is_used) {
                right.count = 1 + current.count;
                right.is_used = 1;
                right.prev = {x: current.x, y: current.y};
                queue.push(right);
            }
        }
    }
    const finish = [];
    for (let i = results.length - 1; i > 0; i--) {
        if (finish.length === 0) {
            finish.unshift(Node.getNodeInMaze(results, target.x, target.y))
        } else {
            const prevNode = Node.getNodeInMaze(results, finish[0].prev && finish[0].prev.x, finish[0].prev && finish[0].prev.y)
            finish.unshift(prevNode);
            if (origin.isEqual(prevNode)) {
                break;
            }
        }
    }
    const count = finish[finish.length - 1].count;
    return {finish, count};
}


console.log(goToMaze(maze, Node.getNodeInMaze(maze, 0, 0), Node.getNodeInMaze(maze, 5, 5)));
