let moves = 0;
let score = 0;
let movesObjective;
let gameInProgress = false;
let randomPlayerPosition = getRandomVertex();
let randomFinishPosition = getRandomVertex();

while (randomPlayerPosition === randomFinishPosition || randomPlayerPosition === randomFinishPosition - 5 || randomPlayerPosition === randomFinishPosition - 1 || randomPlayerPosition === randomFinishPosition + 1 || randomPlayerPosition === randomFinishPosition + 5) {
    randomFinishPosition = getRandomVertex();
}

class Graph {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
        this.playerPosition = randomPlayerPosition;
    }

    addVertex(v) {
        this.AdjList.set(v, []);
    }

    addEdge(v, w) {
        this.AdjList.get(v).push(w);
        this.AdjList.get(w).push(v);
    }

    removeEdge(v, w) {
        const vIndex = this.AdjList.get(v).indexOf(w);
        const wIndex = this.AdjList.get(w).indexOf(v);

        if (vIndex !== -1) {
            this.AdjList.set(v, this.AdjList.get(v).filter(neighbor => neighbor !== w));
        }

        if (wIndex !== -1) {
            this.AdjList.set(w, this.AdjList.get(w).filter(neighbor => neighbor !== v));
        }
    }

    isFinish(vertex) {
        return vertex === randomFinishPosition;
    }

    movePlayer(toVertex) {
        if (this.AdjList.get(this.playerPosition).includes(toVertex)) {
            this.playerPosition = toVertex;

            if (!this.isFinish(this.playerPosition)) {
                updatePlayerPosition();
            } else {
                if (moves + 1 == movesObjective) {
                    gameInProgress = false;
                } else {
                    alert(`Você perdeu! Sua pontuação foi de ${score} pontos.`);
                    location.reload();
                }
            }
        }
    }

    findShortestPath(start, end) {
        const visited = new Set();
        const queue = [[start]];

        while (queue.length > 0) {
            const path = queue.shift();
            const node = path[path.length - 1];
            if (!visited.has(node)) {
                const neighbors = this.AdjList.get(node);
                for (const neighbor of neighbors) {
                    const newPath = [...path, neighbor];
                    if (neighbor === end) {
                        return newPath;
                    }
                    queue.push(newPath);
                }
                visited.add(node);
            }
        }
        return null;
    }
}

var g = new Graph(25);
var vertices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}

for(var i = 1; i <= 25; i++) {
    if (i % 5 !== 0) {
        g.addEdge(i, i + 1);
    }
 
    if (i <= 20) {
        g.addEdge(i, i + 5);
    }
}

const graphContainer = document.getElementById('graph-container');

vertices.forEach(vertex => {
    const node = document.createElement('div');
    node.className = 'graph-node';
    node.textContent = vertex;
    node.setAttribute('data-vertex', vertex);

    if (g.isFinish(vertex)) {
        node.classList.add('finish-node');
    }

    node.addEventListener('click', () => handleNodeClick(vertex));

    graphContainer.appendChild(node);
});

const shortestPathLength = g.findShortestPath(randomPlayerPosition, randomFinishPosition).length - 1;

let minMoves = shortestPathLength;
const maxMoves = 14;

movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;

if ((randomPlayerPosition + randomFinishPosition) % 2 == 0) {
    while (movesObjective % 2 !== 0) movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
} else {
    while (movesObjective % 2 == 0) movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
}

document.getElementById('moves-objective').innerText = movesObjective;

function getRandomVertex() {
    return Math.floor(Math.random() * 25) + 1;
}

function updateGameStatus() {
    let oldObjectiveNode = document.querySelector('.finish-node');
    oldObjectiveNode.classList.remove('finish-node');

    randomFinishPosition = getRandomVertex();
    while (g.playerPosition === randomFinishPosition
        || g.playerPosition === randomFinishPosition - 5 || g.playerPosition === randomFinishPosition - 1
        || g.playerPosition === randomFinishPosition + 1 || g.playerPosition === randomFinishPosition + 5) {
        randomFinishPosition = getRandomVertex();
    }

    let newObjectiveNode = document.querySelector(`.graph-node[data-vertex="${randomFinishPosition}"]`);
    newObjectiveNode.classList.add('finish-node');

    moves = 0;

    let shortestPathLength = g.findShortestPath(g.playerPosition, randomFinishPosition).length - 1;

    minMoves = shortestPathLength;

    movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;

    if ((g.playerPosition + randomFinishPosition) % 2 == 0) {
        while (movesObjective % 2 !== 0) movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
    } else {
        while (movesObjective % 2 == 0) movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
    }

    score++;

    updateUI();
}

function updateUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('moves').innerText = moves;
    document.getElementById('moves-objective').innerText = movesObjective;
}

updatePlayerPosition();

function movePlayerAlongPath(path) {
    const playerNode = document.querySelector('.player-node');
    const graphNodes = document.getElementsByClassName('graph-node');

    function moveStep(index) {
        if (index < path.length) {
            const targetNode = Array.from(graphNodes).find(node => parseInt(node.textContent) === path[index]);
            const rectPlayer = playerNode.getBoundingClientRect();
            const rectTarget = targetNode.getBoundingClientRect();

            const deltaX = rectTarget.left - rectPlayer.left;
            const deltaY = rectTarget.top - rectPlayer.top;

            playerNode.style.animation = `movePlayer 1s linear forwards, playerMove ${Math.abs(deltaX) / 100}s linear 1`;
            playerNode.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

            setTimeout(() => {
                playerNode.style.animation = '';
                playerNode.style.transform = '';
                moveStep(index + 1);
            }, 1000);
        }
    }
    moves++
    moveStep(0);
}

setInterval(myTimer, 500);

function myTimer() {
    if(gameInProgress){
        const shortestPath = g.findShortestPath(g.playerPosition, randomFinishPosition);

        if (shortestPath) {
            g.movePlayer(shortestPath[1]);
            updatePlayerPosition();
            movePlayerAlongPath(shortestPath);

            if (g.isFinish(g.playerPosition)) {
                updateGameStatus();
            }
        }
    }
}

function updatePlayerPosition() {
    const nodes = document.getElementsByClassName('graph-node');
    for (const node of nodes) {
        node.classList.remove('player-node');
        if (parseInt(node.textContent) === g.playerPosition) {
            node.classList.add('player-node');
        }
    }
    document.getElementById('moves').innerText = moves+1;
}

function handleNodeClick(vertex) {
    const clickedNode = document.querySelector(`.graph-node[data-vertex="${vertex}"]`);

    if (clickedNode.classList.contains('blocked-node')) {
        clickedNode.classList.remove('blocked-node');

        if (vertex - 5 > 0 && !g.AdjList.get(vertex).includes(vertex - 5)) g.addEdge(vertex, vertex - 5);
        if (vertex - 1 > 0 && (vertex - 1) % 5 != 0 && !g.AdjList.get(vertex).includes(vertex - 1)) g.addEdge(vertex, vertex - 1);
        if (vertex % 5 != 0 && !g.AdjList.get(vertex).includes(vertex + 1)) g.addEdge(vertex, vertex + 1);
        if (vertex + 5 < 25 && !g.AdjList.get(vertex).includes(vertex + 5)) g.addEdge(vertex, vertex + 5);
    } else {
        clickedNode.classList.add('blocked-node');

        const neighbors = g.AdjList.get(vertex);
        neighbors.forEach(neighbor => {
            g.removeEdge(vertex, neighbor);
        });
    }
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startAnimation);

function startAnimation() {
    gameInProgress = true;
}