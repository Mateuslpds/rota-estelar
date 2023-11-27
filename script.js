function startMeteorShower() {
    const meteorShowerContainer = document.getElementById('graph-container');

    for (let i = 0; i < 11; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = Math.random() * 100 + 'vw';
        meteorShowerContainer.appendChild(meteor);
    }
}
   // Iniciar automaticamente quando a página for carregada
   window.onload = function () {
    startMeteorShower();
};

let moves = 0;
let score = 0;
let movesObjective;
let gameInProgress = false;
let randomPlayerPosition = getRandomVertex();
let randomFinishPosition = getRandomVertex();

// Garante que as posições do jogador e do objetivo não se sobreponham
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

        g.printGraph();
    }

    printGraph() {
        var get_keys = this.AdjList.keys();
        for (var i of get_keys) {
            var get_values = this.AdjList.get(i);
            var conc = "";
            for (var j of get_values)
                conc += j + " ";
            console.log(i + " -> " + conc);
        }
    }

    isFinish(vertex) {
        // Verifica se o nó é o ponto final
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

    // Função para encontrar o caminho mais curto usando BFS
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
        return null; // No path found
    }
}

function getRandomVertex() {
    // Gera um número aleatório entre 1 e 25 (o número total de vértices no seu caso)
    return Math.floor(Math.random() * 25) + 1;
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

/*
g.addEdge(1, 2);
g.addEdge(1, 6);
g.addEdge(2, 3);
g.addEdge(2, 7);
g.addEdge(3, 4);
g.addEdge(3, 8);
g.addEdge(4, 5);
g.addEdge(4, 9);
g.addEdge(5, 10);
g.addEdge(6, 7);
g.addEdge(6, 11);
g.addEdge(7, 8);
g.addEdge(7, 12);
g.addEdge(8, 9);
g.addEdge(8, 13);
g.addEdge(9, 10);
g.addEdge(9, 14);
g.addEdge(10, 15);
g.addEdge(11, 12);
g.addEdge(11, 16);
g.addEdge(12, 13);
g.addEdge(12, 17);
g.addEdge(13, 14);
g.addEdge(13, 18);
g.addEdge(14, 15);
g.addEdge(14, 19);
g.addEdge(15, 20);
g.addEdge(16, 17);
g.addEdge(16, 21);
g.addEdge(17, 18);
g.addEdge(17, 22);
g.addEdge(18, 19);
g.addEdge(18, 23);
g.addEdge(19, 20);
g.addEdge(19, 24);
g.addEdge(20, 25);
g.addEdge(21, 22);
g.addEdge(22, 23);
g.addEdge(23, 24);
g.addEdge(24, 25);
*/

g.printGraph();

// Criação do grid na página HTML
const graphContainer = document.getElementById('graph-container');

vertices.forEach(vertex => {
    const node = document.createElement('div');
    node.className = 'graph-node';
    node.textContent = vertex;
    node.setAttribute('data-vertex', vertex); // Adiciona o atributo data-vertex

    // Adiciona classes adicionais para diferentes tipos de nós
    if (g.isFinish(vertex)) {
        node.classList.add('finish-node');
    }

    // Adiciona evento de clique
    node.addEventListener('click', () => handleNodeClick(vertex));

    graphContainer.appendChild(node);
});

// Calcula o caminho mais curto
const shortestPathLength = g.findShortestPath(randomPlayerPosition, randomFinishPosition).length - 1;

// Define os limites mínimo e máximo para movesObjective
const minMoves = shortestPathLength;
const maxMoves = 14;

movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;

if ((randomPlayerPosition + randomFinishPosition) % 2 == 0) {
    while (movesObjective % 2 !== 0) movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
    console.log("Par: " + movesObjective);
} else {
    while (movesObjective % 2 == 0) movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
    console.log("Ímpar: " + movesObjective);
}

document.getElementById('moves-objective').innerText = movesObjective;

function updateGameStatus() {
    const oldObjectiveNode = document.querySelector('.finish-node');
    oldObjectiveNode.classList.remove('finish-node');

    // Atualiza o objetivo do jogo
    randomFinishPosition = getRandomVertex();
    while (randomPlayerPosition === randomFinishPosition || randomPlayerPosition === randomFinishPosition - 5 || randomPlayerPosition === randomFinishPosition - 1 || randomPlayerPosition === randomFinishPosition + 1 || randomPlayerPosition === randomFinishPosition + 5) {
        randomFinishPosition = getRandomVertex();
    }

    // Adiciona a classe objective-node ao novo quadrado do objetivo
    const newObjectiveNode = document.querySelector(`.graph-node[data-vertex="${randomFinishPosition}"]`);
    newObjectiveNode.classList.add('finish-node');

    // Atualiza a quantidade de movimentos
    moves = 0;

    movesObjective = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;

    // Atualiza a pontuação
    score++;

    // Atualiza a mensagem na interface
    updateUI();
}

function updateUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('moves').innerText = moves;
    document.getElementById('moves-objective').innerText = movesObjective;
}

// Adiciona o jogador no nó inicial
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
    console.log(moves);
    moveStep(0);
}

setInterval(myTimer, 500);

// Função para lidar com o clique no nó
function myTimer() {
    if(gameInProgress){
        const shortestPath = g.findShortestPath(g.playerPosition, randomFinishPosition);

        if (shortestPath) {
            g.movePlayer(shortestPath[1]);
            updatePlayerPosition();
            movePlayerAlongPath(shortestPath);

            // Verifica se o jogador venceu
            if (g.isFinish(g.playerPosition)) {
                updateGameStatus();
            }
        }
    }
}

// Função para atualizar a posição do jogador visualmente
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
    // Adiciona a classe "blocked-node" ao nó clicado
    const clickedNode = document.querySelector(`.graph-node[data-vertex="${vertex}"]`);
    clickedNode.classList.add('blocked-node');

    // Remove as arestas do nó clicado com seus vizinhos
    const neighbors = g.AdjList.get(vertex);
    neighbors.forEach(neighbor => {
        g.removeEdge(vertex, neighbor);
    });
}

// Adiciona um evento de clique ao botão
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startAnimation);

// Função para iniciar a animação
function startAnimation() {
    gameInProgress = true;
}