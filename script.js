const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game assets
const BG_SELECTION = new Image();
BG_SELECTION.src = "Assets/backgrounds/bg_castle.png";

const BG_GAME = new Image();
BG_GAME.src = "Assets/backgrounds/bg_castle.png";

const CHARACTER_IMAGES = [
    "Assets/characters/player_inosuke.png",
    "Assets/characters/player_tanjiro.png",
    "Assets/characters/player_nezuko.png",
    "Assets/characters/player_zenitsu.png",
    "Assets/characters/player_shinobu.png",
    "Assets/characters/player_rengoku.png",
    "Assets/characters/player_giyu.png",
];

const DEMON_IMG = new Image();
DEMON_IMG.src = "Assets/demons/demon_tanjiro.png";

const CHARACTER_NAMES = ["Inosuke", "Tanjiro", "Nezuko", "Zenitsu", "Shinobu", "Rengoku", "Giyu"];

// Game variables
let selectedIndex = 0;
let currentLevel = 1;
let elapsedTime = 0;
let demons = [];
let demonSpawnRate = 2000; // Spawn rate in milliseconds
let demonCount = 0;
let gameStarted = false;
let gameOver = false;
let playerHealth = 100;

// Player object
const player = {
    x: WIDTH / 2 - 50,
    y: HEIGHT - 120,
    width: 75,
    height: 100,
    velocity: 25,
};

// Utility functions
function drawText(text, x, y, fontSize = "30px", color = "yellow") {
    ctx.font = `${fontSize} Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// Draw selection screen
function drawSelectionScreen() {
    ctx.drawImage(BG_SELECTION, 0, 0, WIDTH, HEIGHT);
    drawText("CHOOSE YOUR CHARACTER TO FIGHT", WIDTH / 2 - 300, 200, "30px", "yellow");
    drawText("DEMON KING TANJIRO", WIDTH / 2 - 180, 240, "30px", "yellow");

    const img = new Image();
    img.src = CHARACTER_IMAGES[selectedIndex];
    ctx.drawImage(img, WIDTH / 2 - 100, HEIGHT / 2 - 100, 150, 200);

    drawText(CHARACTER_NAMES[selectedIndex], WIDTH / 2 - 60, HEIGHT / 2 + 150, "20px", "white");
    drawText("Use Left/Right Arrow to select, Enter to start", WIDTH / 2 - 250, HEIGHT - 50, "25px", "white");
}

// Draw game screen
function drawGame() {
    ctx.drawImage(BG_GAME, 0, 0, WIDTH, HEIGHT);
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

    demons.forEach((demon) => {
        ctx.drawImage(DEMON_IMG, demon.x, demon.y, demon.width, demon.height);
    });

    drawText(`Time: ${Math.floor(elapsedTime)}s`, 10, 30, "20px", "yellow");
    drawText(`Level: ${currentLevel}`, WIDTH - 120, 30, "20px", "yellow");
    drawText(`Health: ${playerHealth}`, 10, 60, "20px", "red");
}

// Spawn demons
function spawnDemons() {
    const x = Math.random() * (WIDTH - 75);
    demons.push({ x, y: -95, width: 75, height: 95, velocity: 4.5 });
}

// Update game logic
function updateGame(deltaTime) {
    if (gameOver) return;

    elapsedTime += deltaTime / 1000;
    demonCount += deltaTime;

    if (demonCount >= demonSpawnRate) {
        spawnDemons();
        demonCount = 0;
    }

    // Update demons
    demons.forEach((demon, index) => {
        demon.y += demon.velocity;

        // Check collision with player
        if (
            demon.x < player.x + player.width &&
            demon.x + demon.width > player.x &&
            demon.y < player.y + player.height &&
            demon.y + demon.height > player.y
        ) {
            playerHealth -= 10;
            demons.splice(index, 1);
        }

        // Remove demons that go off-screen
        if (demon.y > HEIGHT) {
            demons.splice(index, 1);
        }
    });

    // Check game over
    if (playerHealth <= 0) {
        gameOver = true;
        drawText("You Lost!", WIDTH / 2 - 100, HEIGHT / 2, "50px", "red");
        setTimeout(() => location.reload(), 3000);
    }
}

// Handle player movement
function handlePlayerMovement() {
    if ((keys["ArrowLeft"] || keys["a"]) && player.x > 0) {
        player.x -= moveSpeed; 
    }

    if ((keys["ArrowRight"] || keys["d"]) && player.x + player.width < canvas.width) {
        player.x += player.velocity; 
    }
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!gameStarted) {
        drawSelectionScreen();
    } else {
        updateGame(deltaTime);
        drawGame();
    }

    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    player.img = new Image();
    player.img.src = CHARACTER_IMAGES[selectedIndex];
    gameStarted = true;
    handlePlayerMovement();
}

// Character selection logic
document.addEventListener("keydown", (e) => {
    if (!gameStarted) {
        if (e.key === "ArrowLeft") {
            selectedIndex = (selectedIndex - 1 + CHARACTER_IMAGES.length) % CHARACTER_IMAGES.length;
            drawSelectionScreen();
        } else if (e.key === "ArrowRight") {
            selectedIndex = (selectedIndex + 1) % CHARACTER_IMAGES.length;
            drawSelectionScreen();
        } else if (e.key === "Enter") {
            startGame();
        }
    }
});

// Start game loop
gameLoop();
