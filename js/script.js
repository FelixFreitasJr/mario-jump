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

// ================= START GAME =================
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

    mainButton.style.display = "none";
    infoText.style.display = "none";

    gameState = "playing";

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

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 100) {

            triggerGameOver();

        }

    }, 10);
}

// ================= GAME OVER =================
function triggerGameOver() {

    gameState = "gameover";

    clearInterval(loop);
    clearInterval(scoreInterval);

    const pipePosition = pipe.offsetLeft;
    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;
    pipe.style.right = "auto";

    const marioPosition =
        +window.getComputedStyle(mario).bottom.replace('px', '');

    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`;

    mario.src = './img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOverSound.play();

    mainButton.textContent = "Reiniciar";
    mainButton.style.display = "inline-block";
}

// ================= RESTART =================
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

    mainButton.textContent = "Iniciar";
    mainButton.style.display = "inline-block";

    infoText.style.display = "block";

    gameState = "start";
}

// ================= JUMP =================
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

// ================= EVENTS =================

// teclado desktop
document.addEventListener('keydown', (e) => {

    // Se ainda não começou, qualquer tecla inicia
    if (gameState === "start") {
        startGame();
        return;
    }

    // Se estiver jogando, só espaço pula
    if (gameState === "playing" && e.code === "Space") {
        jump();
    }

});

// botão principal
mainButton.addEventListener('click', () => {

    if (gameState === "start") {
        startGame();
    } else if (gameState === "gameover") {
        restartGame();
    }

});

// toque mobile
document.addEventListener('touchstart', () => {

    if (gameState === "start") {
        startGame();
    } else if (gameState === "playing") {
        jump();
    }

});