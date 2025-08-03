const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
let score = 0;
let gameRunning = true;

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = generateFood();

// Enhanced colors and effects
const colors = {
  snake: '#4ecdc4',
  snakeHead: '#ff6b6b',
  food: '#ff6b6b',
  background: '#1a1a2e',
  grid: 'rgba(255, 255, 255, 0.1)'
};

document.addEventListener("keydown", changeDirection);

function drawGame() {
  if (!gameRunning) return;
  
  // Clear canvas with gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw subtle grid
  drawGrid();

  // Draw snake with enhanced visuals
  drawSnake();

  // Draw food with glow effect
  drawFood();

  // Move snake
  const head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Check for collision with wall or self
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    collision(head, snake)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = generateFood();
    // Add visual feedback
    addScoreEffect();
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  
  for (let i = 0; i <= canvasSize; i += box) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvasSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvasSize, i);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const x = segment.x + 1;
    const y = segment.y + 1;
    const size = box - 2;
    
    if (index === 0) {
      // Draw head with gradient
      const headGradient = ctx.createRadialGradient(
        x + size/2, y + size/2, 0,
        x + size/2, y + size/2, size/2
      );
      headGradient.addColorStop(0, colors.snakeHead);
      headGradient.addColorStop(1, '#e74c3c');
      
      ctx.fillStyle = headGradient;
      ctx.fillRect(x, y, size, size);
      
      // Add shine effect to head
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + 2, y + 2, size/3, size/3);
    } else {
      // Draw body with color variation
      const bodyColor = `hsl(${180 + index * 5}, 70%, 60%)`;
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x, y, size, size);
      
      // Add subtle border
      ctx.strokeStyle = `hsl(${180 + index * 5}, 70%, 50%)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, size, size);
    }
  });
}

function drawFood() {
  const x = food.x + 2;
  const y = food.y + 2;
  const size = box - 4;
  
  // Create gradient for food
  const gradient = ctx.createRadialGradient(
    x + size/2, y + size/2, 0,
    x + size/2, y + size/2, size/2
  );
  gradient.addColorStop(0, colors.food);
  gradient.addColorStop(1, '#e74c3c');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Add glow effect
  ctx.shadowColor = colors.food;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Add shine effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(x + size/3, y + size/3, size/6, 0, Math.PI * 2);
  ctx.fill();
}

function generateFood() {
  const foodX = Math.floor(Math.random() * (canvasSize / box)) * box;
  const foodY = Math.floor(Math.random() * (canvasSize / box)) * box;
  return { x: foodX, y: foodY };
}

function changeDirection(event) {
  const key = event.key;
  
  // Prevent default for arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    event.preventDefault();
  }
  
  switch (key) {
    case 'ArrowLeft':
      if (direction !== "RIGHT") direction = "LEFT";
      break;
    case 'ArrowUp':
      if (direction !== "DOWN") direction = "UP";
      break;
    case 'ArrowRight':
      if (direction !== "LEFT") direction = "RIGHT";
      break;
    case 'ArrowDown':
      if (direction !== "UP") direction = "DOWN";
      break;
    case ' ':
      togglePause();
      break;
    case 'r':
    case 'R':
      restartGame();
      break;
  }
}

function collision(head, body) {
  for (let i = 1; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) return true;
  }
  return false;
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = score;
    scoreElement.classList.add('score-update');
    setTimeout(() => scoreElement.classList.remove('score-update'), 500);
  }
}

function addScoreEffect() {
  // Create a temporary score effect on canvas
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 24px Orbitron';
  ctx.textAlign = 'center';
  ctx.fillText('+1', canvasSize/2, canvasSize/2);
  
  setTimeout(() => {
    // Clear the effect
    const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  }, 300);
}

function gameOver() {
  gameRunning = false;
  
  // Show game over overlay
  const overlay = document.getElementById('gameOverlay');
  const title = document.getElementById('overlayTitle');
  const message = document.getElementById('overlayMessage');
  
  if (overlay && title && message) {
    title.textContent = 'Game Over!';
    message.textContent = `Final Score: ${score}`;
    overlay.style.display = 'flex';
  }
}

function togglePause() {
  gameRunning = !gameRunning;
  if (gameRunning) {
    // Resume game
    const overlay = document.getElementById('gameOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  } else {
    // Pause game
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const message = document.getElementById('overlayMessage');
    
    if (overlay && title && message) {
      title.textContent = 'Paused';
      message.textContent = 'Press Space to resume';
      overlay.style.display = 'flex';
    }
  }
}

function restartGame() {
  score = 0;
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = generateFood();
  gameRunning = true;
  
  updateScore();
  
  // Hide overlay
  const overlay = document.getElementById('gameOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Setup restart button
document.addEventListener('DOMContentLoaded', () => {
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
  }
});

setInterval(drawGame, 250);
