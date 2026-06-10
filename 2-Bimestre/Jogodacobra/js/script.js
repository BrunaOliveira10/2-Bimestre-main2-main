const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score span");
const winnerText = document.querySelector(".winner");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const size = 30;

/* PLAYER 1 */

const initialPosition1 = {
    x: 120,
    y: 120
};
let snake1 = [initialPosition1];

/* PLAYER 2 */

const initialPosition2 = {
    x: 450,
    y: 450
};
let snake2 = [initialPosition2];
let direction1;
let direction2;
let ghostsEaten = 0;
let gameRunning = true;

/* FUNÇÕES AUXILIARES */


const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / size) * size;
};

/* FANTASMA */

const food = {
    x: randomPosition(),
    y: randomPosition()
};
const drawFood = () => {
    ctx.font = "28px Arial";
    ctx.fillText("👻", food.x, food.y + 25);
};

/* COBRA PLAYER 1 */

const drawSnake1 = () => {

    snake1.forEach((position, index) => {
        ctx.fillStyle = "#00ff66";
        ctx.fillRect(
            position.x,
            position.y,
            size,
            size
        );
        if (index === snake1.length - 1) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(position.x + 8, position.y + 8, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(position.x + 22, position.y + 8, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
};

/* COBRA PLAYER 2 */


const drawSnake2 = () => {

    snake2.forEach((position, index) => {
        ctx.fillStyle = "#ff3333";
        ctx.fillRect(
            position.x,
            position.y,
            size,
            size
        );
        if (index === snake2.length - 1) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(position.x + 8, position.y + 8, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(position.x + 22, position.y + 8, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
};
 
/* MOVIMENTO */

const moveSnake1 = () => {

    if (!direction1) return;
    const head = snake1[snake1.length - 1];
    let newHead;
    if (direction1 === "right")
        newHead = { x: head.x + size, y: head.y };
    if (direction1 === "left")
        newHead = { x: head.x - size, y: head.y };
    if (direction1 === "up")
        newHead = { x: head.x, y: head.y - size };
    if (direction1 === "down")
        newHead = { x: head.x, y: head.y + size };

    // atravessa paredes
    if (newHead.x >= canvas.width)
        newHead.x = 0;
    if (newHead.x < 0)
        newHead.x = canvas.width - size;
    if (newHead.y >= canvas.height)
        newHead.y = 0;
    if (newHead.y < 0)
        newHead.y = canvas.height - size;

    snake1.push(newHead);
    snake1.shift();
};

const moveSnake2 = () => {

    if (!direction2) return;
    const head = snake2[snake2.length - 1];
    let newHead;

    if (direction2 === "right")
        newHead = { x: head.x + size, y: head.y };
    if (direction2 === "left")
        newHead = { x: head.x - size, y: head.y };
    if (direction2 === "up")
        newHead = { x: head.x, y: head.y - size };
    if (direction2 === "down")
        newHead = { x: head.x, y: head.y + size };

    // atravessa paredes
    if (newHead.x >= canvas.width)
        newHead.x = 0;
    if (newHead.x < 0)
        newHead.x = canvas.width - size;
    if (newHead.y >= canvas.height)
        newHead.y = 0;
    if (newHead.y < 0)
        newHead.y = canvas.height - size;

    snake2.push(newHead);
    snake2.shift();
};

/* GRADE */


const drawGrid = () => {

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

/* COMER FANTASMA */

const checkEat = () => {

    const head1 = snake1[snake1.length - 1];
    const head2 = snake2[snake2.length - 1];

    /* PLAYER 1 COME */

    if (
        head1.x === food.x &&
        head1.y === food.y
    ) {
        snake1.push({
            x: head1.x,
            y: head1.y
        });
        food.x = randomPosition();
        food.y = randomPosition();
    }

    /* PLAYER 2 COME */

    if (
        head2.x === food.x &&
        head2.y === food.y
    ) {
        ghostsEaten++;
        score.innerText = ghostsEaten;
        snake2.push({
            x: head2.x,
            y: head2.y
        });
        food.x = randomPosition();
        food.y = randomPosition();
        if (ghostsEaten >= 10) {
            win("🔴 Player 2");
        }
    }
};

/* PLAYER 1 VENCE      CABEÇA DO PLAYER 2         ENCOSTA NO PLAYER 1 */

const checkPlayer1Win = () => {

    const head2 = snake2[snake2.length - 1];

    const collision = snake1.find(segment => {

        return (
            segment.x === head2.x &&
            segment.y === head2.y
        );

    });

    if (collision) {

        win("🟢 Player 1");

    }
};

/* VITÓRIA */


const win = (winner) => {

    gameRunning = false;

    winnerText.innerText =
        "Vencedor: " + winner;

    finalScore.innerText =
        ghostsEaten;

    menu.style.display = "flex";

    canvas.style.filter = "blur(2px)";
};

/* LOOP */

const gameLoop = () => {

    if (!gameRunning) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    drawGrid();
    drawFood();
    moveSnake1();
    moveSnake2();
    drawSnake1();
    drawSnake2();
    checkEat();
    checkPlayer1Win();
    setTimeout(() => {
        gameLoop();
    }, 180);
};

gameLoop();

/* CONTROLES*/

document.addEventListener(
    "keydown",
    ({ key }) => {

        /* PLAYER 1 */

        if (
            key === "ArrowRight" &&
            direction1 !== "left"
        )
            direction1 = "right";
        if (
            key === "ArrowLeft" &&
            direction1 !== "right"
        )
            direction1 = "left";
        if (
            key === "ArrowUp" &&
            direction1 !== "down"
        )
            direction1 = "up";
        if (
            key === "ArrowDown" &&
            direction1 !== "up"
        )
            direction1 = "down";

        /* PLAYER 2 */

        if (
            key === "d" &&
            direction2 !== "left"
        )
            direction2 = "right";
        if (
            key === "a" &&
            direction2 !== "right"
        )
            direction2 = "left";
        if (
            key === "w" &&
            direction2 !== "down"
        )
            direction2 = "up";
        if (
            key === "s" &&
            direction2 !== "up"
        )
            direction2 = "down";
    }
);

/* REINICIAR*/

buttonPlay.addEventListener(
    "click",
    () => {
        snake1 = [
            {
                x: 120,
                y: 120
            }
        ];
        snake2 = [
            {
                x: 450,
                y: 450
            }
        ];
        direction1 = undefined;
        direction2 = undefined;
        ghostsEaten = 0;
        score.innerText = "0";
        gameRunning = true;
        menu.style.display = "none";
        canvas.style.filter = "none";
        food.x = randomPosition();
        food.y = randomPosition();

        gameLoop();
    }
);