const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreValue = document.getElementById('score-value');
const mainButton = document.querySelector('.main-btn');
const infoText = document.querySelector('.info-text');

const jumpSound = document.querySelector('.jump-sound');
const gameOverSound = document.querySelector('.gameover-sound');

let score = 0;
let gameSpeed = 2.5;
const minSpeed = 1;

let loop = null;
let scoreInterval = null;

let gameState = "start"; // start | playing | gameover

// ================= INICIAR =================
function startGame() {

    score = 0;
    scoreValue.textContent = 0;
    gameSpeed = 2.5;

    pipe.style.left = "";
    pipe.style.right = "-80px";
    pipe.style.animation = `pipe-animation ${gameSpeed}s infinite linear`;

    mario.src = './img/mario.gif';
    mario.style.width = '120px';
    mario.style.marginLeft = '0';
    mario.style.bottom = "0px";

    gameState = "playing";

    updateButton();

    startLoop();
}

// ================= LOOP =================
function startLoop() {

    scoreInterval = setInterval(() => {

        score++;
        scoreValue.textContent = score;

        if (score % 200 === 0 && gameSpeed > minSpeed) {

            gameSpeed -= 0.15;
            if (gameSpeed < minSpeed) gameSpeed = minSpeed;

            pipe.style.animationDuration = `${gameSpeed}s`;
        }

    }, 100);

    loop = setInterval(() => {

        const pipePosition = pipe.offsetLeft;
        const marioPosition =
            +window.getComputedStyle(mario).bottom.replace('px', '');

        let collisionLimit = window.innerWidth <= 850? 80:100;

        if (pipePosition <= collisionLimit && pipePosition > 0 && marioPosition < 100) {
            gameOver();
        }

    }, 10);
}

// ================= GAME OVER =================
function gameOver() {

    gameState = "gameover";

    clearInterval(loop);
    clearInterval(scoreInterval);

    const pipePosition = pipe.offsetLeft;
    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;
    pipe.style.right = "auto";

    const marioPosition =
        +window.getComputedStyle(mario).bottom.replace('px', '');

    mario.style.bottom = `${marioPosition}px`;

    mario.src = './img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOverSound.play();

    updateButton();
}

// ================= REINICIAR =================
function restartGame() {

    clearInterval(loop);
    clearInterval(scoreInterval);

    pipe.style.animation = "none";
    pipe.style.left = "";
    pipe.style.right = "-80px";

    mario.src = './img/mario.gif';
    mario.style.width = '120px';
    mario.style.marginLeft = '0';
    mario.style.bottom = "0px";

    score = 0;
    scoreValue.textContent = 0;

    gameState = "start";

    updateButton();
}

// ================= PULO =================
function jump() {

    if (gameState !== "playing") return;
    if (mario.classList.contains('jump')) return;

    mario.classList.add('jump');

    jumpSound.currentTime = 0;
    jumpSound.play();

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

// ================= BOTÃO DINÂMICO =================
function updateButton() {

    if (gameState === "start") {
        mainButton.textContent = "Iniciar";
        mainButton.style.display = "inline-block";
        infoText.style.visibility = "visible";
    }

    if (gameState === "playing") {

        // Se for mobile mostra botão Pular
        if (window.innerWidth <= 850) {
            mainButton.textContent = "Pular";
            mainButton.style.display = "inline-block";
        } else {
            mainButton.style.display = "none";
        }

        infoText.style.visibility = "hidden";
    }

    if (gameState === "gameover") {
        mainButton.textContent = "Reiniciar";
        mainButton.style.display = "inline-block";
    }
}

// ================= EVENTOS =================

// TECLADO
document.addEventListener('keydown', (e) => {

    if (e.code === "Space") {
        e.preventDefault();
    }

    if (gameState === "start") {
        startGame();
        return;
    }

    if (gameState === "playing" && e.code === "Space") {
        jump();
    }
});

// BOTÃO PRINCIPAL
mainButton.addEventListener('click', () => {

    if (gameState === "start") {
        startGame();
        return;
    }

    if (gameState === "playing") {
        jump();
        return;
    }

    if (gameState === "gameover") {
        restartGame();
        return;
    }
});

// Atualiza botão ao carregar
updateButton();