// Game canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let gameOver = false;
let animationFrameId;

// Player properties
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

// Bullets array
const bullets = [];

// Enemies array
const enemies = [];

// Input handling
const keys = {};

// Event listeners for keyboard input
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

// Draw player
function drawPlayer() {
    ctx.fillStyle = '#00f';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Create bullet
function createBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7
    });
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = '#ff0';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Update bullets position
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        
        // Remove bullets that are off screen
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Create enemy
function createEnemy() {
    const enemyWidth = 40;
    const enemyHeight = 40;
    const enemyX = Math.random() * (canvas.width - enemyWidth);
    
    enemies.push({
        x: enemyX,
        y: -enemyHeight,
        width: enemyWidth,
        height: enemyHeight,
        speed: 2 + Math.random() * 2
    });
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = '#f00';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Update enemies position
function updateEnemies() {
    if (Math.random() < 0.02) {
        createEnemy();
    }
    
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed;
        
        // Check collision with player
        if (
            player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y
        ) {
            gameOver = true;
        }
        
        // Check collision with bullets
        for (let j = 0; j < bullets.length; j++) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ) {
                // Remove enemy and bullet
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                i--;
                score += 10;
                break;
            }
        }
        
        // Remove enemies that are off screen
        if (enemies[i] && enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

// Update player movement
function updatePlayer() {
    player.dx = 0;
    
    // Move player left and right
    if (keys['ArrowLeft'] || keys['a']) {
        player.dx = -player.speed;
    }
    
    if (keys['ArrowRight'] || keys['d']) {
        player.dx = player.speed;
    }
    
    // Fire bullet
    if (keys[' '] && bullets.length < 10) {
        createBullet();
        keys[' '] = false; // Only fire once per press
    }
    
    // Update player position
    player.x += player.dx;
    
    // Prevent player from going off screen
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.font = '18px Arial';
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 50);
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameOver) {
        // Update game elements
        updatePlayer();
        updateBullets();
        updateEnemies();
        
        // Draw game elements
        drawPlayer();
        drawBullets();
        drawEnemies();
        drawScore();
        
        // Continue animation
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
        
        // Check for restart
        if (keys['r']) {
            restartGame();
        }
    }
}

// Restart game
function restartGame() {
    score = 0;
    gameOver = false;
    player.x = canvas.width / 2 - 25;
    bullets.length = 0;
    enemies.length = 0;
    keys['r'] = false;
    
    cancelAnimationFrame(animationFrameId);
    gameLoop();
}

// Start the game
gameLoop();