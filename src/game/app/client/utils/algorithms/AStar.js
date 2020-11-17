'use strict';

const w = 0; //walkable
const u = 1; //unwalkable
const s = 2; //start
const g = 3; //goal

/**
 * The A-Star search algorithm for calculating the shortest path between two nodes with positive edge cost.
 * It uses an estimator(heuristic) to estimate the cost from the current node to the goal node. 
 * The heuristic is needed to reduce runtime of this algorithm.
 */
class AStar {
    /**
       * 
       * map format 2D Array:
	   * 1 = unwalkable, 0 = walkable, 2 = start , 3 = goal
	   * if map is not sane (no u,w,s and g) then does not fail gracefully
	   * map format e.g.: 
       * [ [1, 1, 1, 1, 1],  
       *   [0, 0, 0, 0, 3],  
       *   [0, 0, 1, 0, 0],  
       *   [2, 0, 1, 0, 0],  
       *   [1, 1, 1, 0, 0] ]
       * 
       * cost between two neighbour nodes is always 1.
       * 
       * @param {number[][]} map 
       * @param {String} heuristic "manhattan" – the speedy Manhattan method, which adds up the x and y distance
	                               "diagonal" – uses a diagonal line, plus any remaining x/y distance
	                               "euclidean" – The familiar, elementary distance formula, accurate but slow
       * @param {Boolean} diagonalTraverse true - diagonal paths can be taken(includes steps between two unwalkable nodes.)
       *                                false - no diagonal paths can be taken
       */
      static astarSearch(map, heuristic, diagonalTraverse) {
        var openList = []; //PriorityQueue with nodes
        var closedList = []; //Set with nodes.
        var path = []; //Set with sampling points.
        
        var goalNode = this.createNode(map, heuristic, g, null);
        var startNode = this.createNode(map, heuristic, s, goalNode);

        this.addNodeToList(openList, startNode);

        var currentNode;
        while( !this.isListEmpty(openList) ) {

            currentNode = this.getNodeWithLowestFScore(openList);
            
            //Is the goal found?
            if ( this.areNodesEqual(currentNode, goalNode) ) {
                this.addSamplingPointToPath(path, currentNode);
                path.reverse();
                //console.log("Found Solution!");
                return path;
            }

            this.addNodeToList(closedList, currentNode);
            this.removeNodeFromList(openList, currentNode);
            currentNode.makeNeighbourNodes(map, heuristic, diagonalTraverse, goalNode);
            this.expandNode(openList, closedList, currentNode);
        }
        
        //No solution found.
        //console.log("no solution")
        return null;
    }

    /**
     * checks all successor nodes and adds them to the open list when either
     * - the successor node was found for the first time, or
     * - a better path was found to this node
     * @param {Node} currentNode
     */
    static expandNode(openList, closedList, currentNode){
        currentNode.neighbourNodes.forEach(successor => {
            if ( this.contains(closedList, successor) )
                return;
            
            var tempG = currentNode.g + 1;
            var containsSuccessor = this.contains(openList, successor);

            //if the current successor node was already visited then 
            //check if got better cost to get to this node exists through
            //the current node(parent node).
            if (containsSuccessor && tempG >= successor.g)
                return;
            
            successor.g = tempG;

            successor.parentNode = currentNode;

            if (containsSuccessor) {
                successor.f = successor.g + successor.h;
            } else {
                successor.f = successor.g + successor.h;
                openList.push(successor);
            }
        });
    }

    /**
     * Wraps the coordinates of a node to an object and adds that object to the path array.
     * Calls this function recursively on parent nodes of this node.
     * 
     * @param {Object[]} path 
     * @param {Node} node 
     */
    static addSamplingPointToPath(path, node){
        path.push({x: node.row, y: node.col});

        if(node.parentNode == null)
            return;
        
        this.addSamplingPointToPath(path, node.parentNode);
    }

    static contains(searchList, currentNode) {
        return searchList.find(elem => this.areNodesEqual(currentNode, elem)) == undefined ? false : true;
    }
    /**
     * Determines if two nodes are equal by comparing their coordinates.
     * 
     * @param {Node} nodeA 
     * @param {Node} nodeB 
     */
    static areNodesEqual(nodeA, nodeB){
        return (nodeA.row == nodeB.row && nodeA.col == nodeB.col);
    }

    /**
     * Gets the node with the lowest f score from the list.
     * 
     * @param {Node[]} list 
     */
    static getNodeWithLowestFScore(list){
        var lowestNode = list[0], x;
        
        for(x in list) {
            if (list[x].f < lowestNode.f) lowestNode = list[x];
        }
        
        return lowestNode;
    }

    /**
     * Adds a node to a list of nodes.
     * 
     * @param {Node[]} list 
     * @param {Node} node 
     */
    static addNodeToList(list, node){
        list.push(node);
    }

    /**
     * Removes a node from the list of nodes.
     * 
     * @param {Node[]} list 
     * @param {Node} node 
     */
    static removeNodeFromList(list, node){
        for(var i = list.length - 1; i >= 0; i--) {
            if (list[i].row == node.row && list[i].col == node.col) {
                list.splice(i,1);
                break;
            }
        }
    }

    /**
     * Checks if the list is empty.
     * 
     * @param {Node[]} list 
     */
    static isListEmpty(list){
        return ((list.length < 1) ? true : false);
    }

    /**
     * Creates nodes for the given node type.
     * 
     * @param {number[][]} map 
     * @param {String} heuristic 
     * @param {number} nodeType 
     * @param {Node} goalNode 
     */
    static createNode(map, heuristic, nodeType, goalNode) {
        var mapRows = map.length;
        var mapCols = map[0].length;

        for(var row = 0; row < mapRows; row++) {
            for(var col = 0; col < mapCols; col++) {
                if (map[row][col] == nodeType) return new Node(row, col, map, heuristic, null, goalNode);
            }
        }
        return null;
    }
}

/**
 * The Node class
 */
class Node {

    /**
     * Creates an instance of a node and determines the heuristic value 
     * and the estimated cost f from this node to the goal node.
     * @param {number} row 
     * @param {number} col 
     * @param {number[][]} map 
     * @param {String} heuristic 
     * @param {Node} parentNode 
     * @param {Node} goalNode 
     */
    constructor(row, col, map, heuristic, parentNode, goalNode) {
        this.mapNumRows = map.length;
        this.mapNumColumns = map[0].length;
        this.row = row;
        this.col = col;
        this.northNeighbour = (row == 0) ? 0 : row - 1;
        this.southNeighbour = (row == this.mapNumRows - 1) ? this.mapNumRows - 1 : row + 1;
        this.westNeighbour = (col == 0) ? 0 : col -1;
        this.eastNeighbour = (col == this.mapNumColumns - 1) ? this.mapNumColumns - 1 : col + 1;
        this.heuristic = heuristic;
        this.parentNode = parentNode;
        this.goalNode = goalNode;
        this.neighbourNodes = [];

        //determine the start costs for the node.
        if (parentNode != null) {
            if (row == parentNode.row || col == parentNode.col)
                //if its not a diagonal parent
				this.g = parentNode.g + 10;
            else
                //if its a diagonal parent
				this.g = parentNode.g + 14;
			this.h = this.getHeuristicScore(this.row, this.col, heuristic, goalNode);
		}
		else {
			this.g = 0;
			if (map[row][col] == s)
				this.h = this.getHeuristicScore(this.row, this.col, heuristic, goalNode);
			else
				this.h = 0;
        }
        this.f = this.g + this.h;
    }

    /**
     * Creates neighbour nodes of current node if they are walkable.
     * 
     * @param {number[][]} map 
     * @param {String} heuristic 
     * @param {Boolean} diagonalTraverse 
     * @param {Node} goalNode 
     */
    makeNeighbourNodes(map, heuristic, diagonalTraverse, goalNode) {
        for (var i = this.northNeighbour; i <= this.southNeighbour; i++) {
            for (var j = this.westNeighbour; j <= this.eastNeighbour; j++) {
                if (i != this.row || j != this.col) {
                    if (map[i][j] != u) {
                        if(diagonalTraverse) 
                            this.neighbourNodes.push(new Node(i, j, map, heuristic, this, goalNode));
                        else
                            if(i == this.row || j == this.col)
                                this.neighbourNodes.push(new Node(i, j, map, heuristic, this, goalNode));
                    }
                }
            }
        }
    }

    /**
     * Returns the heuristic value.
     * 
     * @param {Number} nodeRow 
     * @param {Number} nodeCol 
     * @param {String} heuristic 
     * @param {Node} goalNode 
     */
    getHeuristicScore(nodeRow, nodeCol, heuristic, goalNode){
        var y = Math.abs(nodeRow - goalNode.row);
        var x = Math.abs(nodeCol - goalNode.col);
        
		switch (heuristic) {
			case "manhattan":
				return (y + x) * 10;
			case "diagonal":
				return (x > y) ? (y * 14) + 10 * (x - y) : (x * 14) + 10 * (y - x);
			case "euclidean":
				return Math.sqrt((x * x) + (y * y));
			default:
				return null;
		}
    }
}