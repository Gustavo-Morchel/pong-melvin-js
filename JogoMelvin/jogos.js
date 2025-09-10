// --- Jogadores ---
const player = document.getElementById("player");
const player2 = document.getElementById("player2");

// --- Gamepad ---
const { GamepadListener } = gamepad;
const listener = new GamepadListener();
listener.on('gamepad:axis', onButtonChange);
listener.start();

function onButtonChange(e) {
  if (e.detail.value === -1) wPressed = true;
  else if (e.detail.value === 0.14285719394683838) sPressed = true;
  else if (e.detail.value === 3.2857141494750977) { wPressed = false; sPressed = false; }
}

// --- Configuração inicial dos jogadores ---
player.style.height = player2.style.height = "120px";
player.style.width = player2.style.width = "20px";
player.style.position = player2.style.position = "absolute";

player.style.top = "200px";
player.style.left = "200px";
player2.style.top = "200px";
player2.style.left = window.innerWidth - 220 + "px";

let posX = 200, posY = 200;
let posX2 = window.innerWidth - 220, posY2 = 200;
const largura = 20;
const altura = 120;
const velocidade = 10;

// --- Controles do teclado ---
let upPressed = false, downPressed = false, wPressed = false, sPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
  if (e.key.toLowerCase() === "w") wPressed = true;
  if (e.key.toLowerCase() === "s") sPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
  if (e.key.toLowerCase() === "w") wPressed = false;
  if (e.key.toLowerCase() === "s") sPressed = false;
});

// --- Atualiza posição dos jogadores ---
function tickPlayer() {
  // Jogador 1
  if (upPressed) posY -= velocidade;
  if (downPressed) posY += velocidade;
  posY = Math.max(0, Math.min(window.innerHeight - altura, posY));
  player.style.top = posY + "px";
  player.style.left = posX + "px";

  // Jogador 2
  if (wPressed) posY2 -= velocidade;
  if (sPressed) posY2 += velocidade;
  posY2 = Math.max(0, Math.min(window.innerHeight - altura, posY2));
  player2.style.top = posY2 + "px";
  player2.style.left = posX2 + "px";

  requestAnimationFrame(tickPlayer);
}
tickPlayer();

// --- Bola ---
const ball = document.createElement("img");
ball.src = "melvin.png";
ball.style.position = "absolute";
ball.style.width = ball.style.height = "32px";
ball.style.borderRadius = "50%";
document.body.appendChild(ball);

let velX = 6, velY = 6;
const velMax = 30;
let score1 = 0, score2 = 0;
const scoreEl = document.getElementById("score");
let ballResetting = false;

// --- Imagem central que aparece ao marcar ponto ---
const centerImg = document.createElement("img");
centerImg.src = "melvin.png";
centerImg.id = "center-img";
centerImg.style.position = "fixed";
centerImg.style.top = "50%";
centerImg.style.left = "50%";
centerImg.style.transform = "translate(-50%, -50%) scale(0.05)";
centerImg.style.width = "400px";
centerImg.style.display = "none";
centerImg.style.zIndex = "9999";
document.body.appendChild(centerImg);

// --- Confetes à esquerda e direita ---
const confeteLeft = document.createElement("img");
confeteLeft.src = "confete.png";
confeteLeft.style.position = "fixed";
confeteLeft.style.top = "50%";
confeteLeft.style.left = "calc(50% - 300px)";
confeteLeft.style.transform = "translate(-50%, -50%)";
confeteLeft.style.width = "200px";
confeteLeft.style.display = "none";
confeteLeft.style.zIndex = "9999";
document.body.appendChild(confeteLeft);

const confeteRight = document.createElement("img");
confeteRight.src = "confete.png";
confeteRight.style.position = "fixed";
confeteRight.style.top = "50%";
confeteRight.style.left = "calc(50% + 300px)";
confeteRight.style.transform = "translate(-50%, -50%) scaleX(-1)";
confeteRight.style.width = "200px";
confeteRight.style.display = "none";
confeteRight.style.zIndex = "9999";
document.body.appendChild(confeteRight);

// --- Movimento oscilante dos confetes ---
let confeteSpeed = 1.5, confeteDirLeft = 1, confeteDirRight = -1;
function tickConfetes() {
  if (centerImg.style.display === "block") {
    let topLeft = parseFloat(confeteLeft.style.top) || 50;
    topLeft += confeteSpeed * confeteDirLeft;
    if (topLeft >= 60) confeteDirLeft = -1;
    if (topLeft <= 40) confeteDirLeft = 1;
    confeteLeft.style.top = topLeft + "%";

    let topRight = parseFloat(confeteRight.style.top) || 50;
    topRight += confeteSpeed * confeteDirRight;
    if (topRight >= 60) confeteDirRight = -1;
    if (topRight <= 40) confeteDirRight = 1;
    confeteRight.style.top = topRight + "%";
  }
  requestAnimationFrame(tickConfetes);
}
tickConfetes();

// --- Reseta a bola e animação do Melvin ---
function resetBall(direction = 1, showImage = true) {
  setLeft(ball, window.innerWidth / 2 - getWidth(ball) / 2);
  setTop(ball, window.innerHeight / 2 - getHeight(ball) / 2);
  ballResetting = true;

  if (showImage) {
    centerImg.style.display = "block";
    confeteLeft.style.display = "block";
    confeteRight.style.display = "block";

    let scale = 0.05;
    const targetScale = 1;
    const speed = 0.015;

    function animateScale() {
      scale += speed;
      if (scale >= targetScale) scale = targetScale;
      centerImg.style.transform = `translate(-50%, -50%) scale(${scale})`;
      if (scale < targetScale) requestAnimationFrame(animateScale);
    }
    animateScale();
  }

  setTimeout(() => {
    velX = 6 * direction;
    velY = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballResetting = false;

    if (showImage) {
      centerImg.style.display = "none";
      confeteLeft.style.display = "none";
      confeteRight.style.display = "none";
    }
  }, 5000);
}
resetBall(1, false);

// --- Movimento da bola ---
function tickBall() {
  let top = getTop(ball);
  let left = getLeft(ball);
  const width = getWidth(ball), height = getHeight(ball);

  if (!ballResetting) {
    left += velX;
    top += velY;

    if (top <= 0) { top = 0; velY *= -1; }
    if (top + height >= window.innerHeight) { top = window.innerHeight - height; velY *= -1; }

    if (checkCollision(ball, player)) {
      left = getLeft(player) + largura;
      velX = Math.min(Math.abs(velX) + 0.5, velMax);
      velY = velY > 0 ? Math.min(velY + 0.2, velMax) : Math.max(velY - 0.2, -velMax);
    }
    if (checkCollision(ball, player2)) {
      left = getLeft(player2) - width;
      velX = -Math.min(Math.abs(velX) + 0.5, velMax);
      velY = velY > 0 ? Math.min(velY + 0.2, velMax) : Math.max(velY - 0.2, -velMax);
    }

    setLeft(ball, left);
    setTop(ball, top);

    // Atualiza pontuação e reinicia bola se marcar
    if (left <= 0) { score2++; scoreEl.textContent = `${score1} : ${score2}`; resetBall(1, true); }
    if (left + width >= window.innerWidth) { score1++; scoreEl.textContent = `${score1} : ${score2}`; resetBall(-1, true); }
  } else {
    setLeft(ball, window.innerWidth / 2 - getWidth(ball) / 2);
    setTop(ball, window.innerHeight / 2 - getHeight(ball) / 2);
  }

  requestAnimationFrame(tickBall);
}
tickBall();

// --- Checa colisão entre bola e jogadores ---
function checkCollision(rect, playerEl) {
  const rectLeft = getLeft(rect), rectTop = getTop(rect), rectWidth = getWidth(rect), rectHeight = getHeight(rect);
  const playerLeft = getLeft(playerEl), playerTop = getTop(playerEl), playerWidth = getWidth(playerEl), playerHeight = getHeight(playerEl);
  return rectLeft < playerLeft + playerWidth && rectLeft + rectWidth > playerLeft && rectTop < playerTop + playerHeight && rectTop + rectHeight > playerTop;
}

// --- Utilitários ---
function getWidth(el) { return el.offsetWidth; }
function getHeight(el) { return el.offsetHeight; }
function getTop(el) { return parseFloat(el.style.top) || 0; }
function getLeft(el) { return parseFloat(el.style.left) || 0; }
function setTop(el, top) { el.style.top = top + "px"; }
function setLeft(el, left) { el.style.left = left + "px"; }

// --- Ajusta posição player2 ao redimensionar ---
window.addEventListener("resize", () => {
  posX2 = window.innerWidth - 220;
  player2.style.left = posX2 + "px";
});
