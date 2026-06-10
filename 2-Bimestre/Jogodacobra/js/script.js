const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score span");
const winnerText = document.querySelector(".winner");

const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const size = 30;

/*PLAYERS*/

let snake1 = [{ x: 120, y: 120 }];
let snake2 = [{ x: 450, y: 450 }];

let direction1 = "right";
let direction2 = "left";

let ghostsEaten = 0;
let gameRunning = true;

/* FANTASMA*/

const food = {
    x: randomPosition(),
    y: randomPosition()
};

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomPosition() {
    const pos = randomNumber(0, canvas.width - size);
    return Math.round(pos / size) * size;
}

function drawGhost() {
    ctx.font = "28px Arial";
    ctx.fillText("👻", food.x, food.y + 25);
}

/* DESENHAR COBRAS*/

function drawSnake(snake, color) {

    snake.forEach((segment, index) => {

        ctx.fillStyle = color;
        ctx.fillRect(segment.x, segment.y, size, size);

        // cabeça com olhos
        if (index === snake.length - 1) {

            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(segment.x + 8, segment.y + 10, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(segment.x + 22, segment.y + 10, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

/* MOVIMENTO (SEM MORRER NA PAREDE)*/

function moveSnake(snake, direction) {

    const head = snake[snake.length - 1];

    let newHead = {
        x: head.x,
        y: head.y
    };

    if (direction === "right") newHead.x += size;
    if (direction === "left") newHead.x -= size;
    if (direction === "up") newHead.y -= size;
    if (direction === "down") newHead.y += size;

    // 🔁 TELEPORTA NAS BORDAS
    if (newHead.x >= canvas.width) newHead.x = 0;
    if (newHead.x < 0) newHead.x = canvas.width - size;

    if (newHead.y >= canvas.height) newHead.y = 0;
    if (newHead.y < 0) newHead.y = canvas.height - size;

    snake.push(newHead);
    snake.shift();
}

/* COMER FANTASMA (PLAYER 2)*/

function checkEat() {

    const head = snake2[snake2.length - 1];

    if (head.x === food.x && head.y === food.y) {

        ghostsEaten++;
        score.innerText = ghostsEaten;

        snake2.push({ ...head });

        food.x = randomPosition();
        food.y = randomPosition();

        if (ghostsEaten >= 10) {
            win("🔴 Player 2");
        }
    }
}

// =====================
// PLAYER 1 GANHA (ENCOSTA NO PLAYER 2)
// =====================

function checkPlayer1Win() {

    const head1 = snake1[snake1.length - 1];

    const hit = snake2.find((segment, index) => {
        return index < snake2.length - 1 &&
            segment.x === head1.x &&
            segment.y === head1.y;
    });

    if (hit) {
        win("🟢 Player 1");
    }
}

// =====================
// DESENHAR GRADE
// =====================

function drawGrid() {

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#222";

    for (let i = 0; i < canvas.width; i += size) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// =====================
// VITÓRIA
// =====================

function win(winner) {

    gameRunning = false;

    winnerText.innerText = "Vencedor: " + winner;
    finalScore.innerText = ghostsEaten;

    menu.style.display = "flex";
    canvas.style.filter = "blur(3px)";
}

/* LOOP DO JOGO*/

function gameLoop() {

    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawGhost();

    moveSnake(snake1, direction1);
    moveSnake(snake2, direction2);

    drawSnake(snake1, "#00ff66");
    drawSnake(snake2, "#ff3333");

    checkEat();
    checkPlayer1Win();

    setTimeout(gameLoop, 180);
}

gameLoop(); 

/* CONTROLES*/

document.addEventListener("keydown", ({ key }) => {

    // PLAYER 1
    if (key === "ArrowRight" && direction1 !== "left") direction1 = "right";
    if (key === "ArrowLeft" && direction1 !== "right") direction1 = "left";
    if (key === "ArrowUp" && direction1 !== "down") direction1 = "up";
    if (key === "ArrowDown" && direction1 !== "up") direction1 = "down";

    // PLAYER 2 (WASD)
    if (key === "d" && direction2 !== "left") direction2 = "right";
    if (key === "a" && direction2 !== "right") direction2 = "left";
    if (key === "w" && direction2 !== "down") direction2 = "up";
    if (key === "s" && direction2 !== "up") direction2 = "down";
});

// =====================
// REINICIAR
// =====================

buttonPlay.addEventListener("click", () => {

    snake1 = [{ x: 120, y: 120 }];
    snake2 = [{ x: 450, y: 450 }];

    direction1 = "right";
    direction2 = "left";

    ghostsEaten = 0;

    score.innerText = "0";

    gameRunning = true;

    menu.style.display = "none";
    canvas.style.filter = "none";

    gameLoop();
});
