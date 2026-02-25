const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreValue = document.getElementById('score-value');
const resetButton = document.querySelector('.reset');
const jumpButton = document.querySelector('.jump-btn');

const jumpSound = document.querySelector('.jump-sound');
const gameOverSound = document.querySelector('.gameover-sound');

let score = 0;
let gameOver = false;

// ===== CONTROLE DE VELOCIDADE =====
let gameSpeed = 2.5;     // começa devagar (3 segundos)
const minSpeed = 1;    // velocidade máxima (mais difícil)

// aplica velocidade inicial
pipe.style.animationDuration = `${gameSpeed}s`;


// ===== FUNÇÃO DE PULO =====
const jump = () => {
    if (gameOver) return;

    // impede pulo duplo enquanto está no ar
    if (mario.classList.contains('jump')) return;

    mario.classList.add('jump');

    jumpSound.currentTime = 0;
    jumpSound.play();

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
};

// teclado (desktop)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// botão mobile
jumpButton.addEventListener('touchstart', jump);
jumpButton.addEventListener('click', jump);


// ===== CONTADOR DE PONTOS + AUMENTO DE DIFICULDADE =====
const scoreInterval = setInterval(() => {

    if (!gameOver) {

        score++;
        scoreValue.textContent = score;

        // aumenta dificuldade a cada 200 pontos
        if (score % 200 === 0 && gameSpeed > minSpeed) {

            gameSpeed -= 0.15;

            if (gameSpeed < minSpeed) {
                gameSpeed = minSpeed;
            }

            pipe.style.animationDuration = `${gameSpeed}s`;
        }
    }

}, 100);


// ===== LOOP PRINCIPAL DO JOGO =====
const loop = setInterval(() => {

    const pipePosition = pipe.offsetLeft;
    const marioPosition =
        +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {

        gameOver = true;

        gameOverSound.play();

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        resetButton.classList.remove('hidden');

        clearInterval(loop);
        clearInterval(scoreInterval);
    }

}, 10);


// ===== RESET =====
resetButton.addEventListener('click', () => {
    location.reload();
});