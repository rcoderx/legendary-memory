const canvas = document.getElementById('gameCanvas');
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Prevent the default touch action (scrolling, zooming, etc.)
}, { passive: false }); // Setting passive to false allows preventDefault to work

const wallThickness = 20; // Thickness of the wall
    const gridSize = 20; // Define the grid size to match the snake's movement
const ctx = canvas.getContext('2d');
const grid = 20;
let speed = 2;


function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};




// Disable the right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable all keys except WASD, Enter, and arrow keys
document.addEventListener('keydown', event => {
    // Key codes: W(87), A(65), S(83), D(68), Enter(13), Arrow Keys(37-40)
    const allowedKeys = [87, 65, 83, 68, 13, 37, 38, 39, 40];

    if (!allowedKeys.includes(event.keyCode)) {
        event.preventDefault();
    }
});


let bobbingAmount = 0;
let bobbingDirection = 1;
let highScore = localStorage.getItem('highScore') || 0;
// Load the images
let snakeImage = new Image();
const selectedAvatar = localStorage.getItem('selectedAvatar') || 'snake.png'; // Default to 'avatar1.png' if no avatar is selected
snakeImage.src = selectedAvatar;
const birdImage = new Image();
birdImage.src = 'bird.png'; // Replace with the actual path

// Sound effects
const eatSound = new Audio('eatsound.mp3');
const gameOverSound = new Audio('gameover.wav');

// Background music
const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

let gameInProgress = false;
let snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
let dx = grid;
let dy = 0;
let food = { x: Math.floor(Math.random() * (canvas.width / grid)) * grid, y: Math.floor(Math.random() * (canvas.height / grid)) * grid };
let score = 0;

// Animation frame for smoother animation
let animationFrameId;

let lastRenderTime = 0;
 // Ensure this is set correctly in your script
 

 function main(currentTime) {
    if (!gameInProgress) return;
    
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / speed) return;

    lastRenderTime = currentTime;

    clearCanvas();
    drawWalls();
    drawFood();
    advanceSnake();
    drawSnake();

    // Update bobbing logic
    bobbingAmount += 0.2 * bobbingDirection;
    if (bobbingAmount > 5 || bobbingAmount < -5) {
        bobbingDirection *= -1;
    }

    if (didGameEnd()) {
        gameOverSound.play();
        backgroundMusic.pause();
        restartButton.style.display = 'block'; // Show Restart button
        gameInProgress = false;
            handleGameOver();
            return; // Stop the game loop
        }
    }   
    function updateLivesDisplay(lives) {
        document.getElementById('livesCount').innerText = lives;
    }
     

window.requestAnimationFrame(main); // Start the game loop


    clearCanvas();
    drawWalls();
    drawFood();
    advanceSnake();
    drawSnake();

    animationFrameId = requestAnimationFrame(main);

// Start and Restart Button Event Listeners
startButton.addEventListener('click', function() {
    gameInProgress = true;
    startButton.style.display = 'none'; // Hide Start button
    backgroundMusic.play(); // Play the background music

    // Check if it's a mobile device
    if(isMobileDevice()) {
        // Adjust canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Increase snake and bird size for mobile
        const scaleFactor = 1.2; // Adjust this factor to scale size
        grid *= scaleFactor; // Increase grid size which will increase the size of snake and bird

        // Optionally, zoom or adjust the viewport
        // You might need to adjust or reset these values when switching back to desktop view
        document.body.style.zoom = 1.2; // Zoom in the body, you might want to adjust this value
    }

    window.requestAnimationFrame(main);
});




restartButton.addEventListener('click', function() {
    resetGame();
    gameInProgress = true;
    restartButton.style.display = 'none'; // Hide Restart button
    backgroundMusic.play(); // Play the background music
    window.requestAnimationFrame(main);
});



function resetGame() {
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 }
    ];
    dx = grid;
    dy = 0;
    score = 0;
    document.getElementById('score').innerHTML = score;
    createFood(); // Create initial food
}

// Function to toggle background music
function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

function resetGame() {
    snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
    dx = grid;
    dy = 0;
    score = 0;
    document.getElementById('score').innerHTML = score;
    createFood(); // Create initial food
}

function clearCanvas() {
    ctx.fillStyle = '#080101';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    // Adjust the bird's vertical position based on bobbingAmount
    const birdYPosition = food.y + bobbingAmount;

    // Draw the bird with the adjusted Y position
    ctx.drawImage(birdImage, food.x, birdYPosition, grid, grid);
}



function advanceSnake() {
    let nextHeadX = snake[0].x + dx;
    let nextHeadY = snake[0].y + dy;

    // Pass through walls: reappear on the opposite side
    if (nextHeadX >= canvas.width) {
        nextHeadX = 0;
    } else if (nextHeadX < 0) {
        nextHeadX = canvas.width - grid;
    }

    if (nextHeadY >= canvas.height) {
        nextHeadY = 0;
    } else if (nextHeadY < 0) {
        nextHeadY = canvas.height - grid;
    }

    const head = { x: nextHeadX, y: nextHeadY };
    console.log("Snake Head: ", snake[0], "Food: ", food);

    // Check if the snake has eaten the food
    const didEatFood = head.x === food.x && head.y === food.y;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        createFood();
        speed += 0.5;
        eatSound.play();  // Play eating sound
        // No need to remove the last segment (the snake grows by one segment).
    } else {
        snake.pop(); // Remove the last segment to maintain the same length
    }

    snake.unshift(head);  // Add the new head to the snake
    console.log("Ate Food! Score: ", score, "New Speed: ", speed);
}

function createFood() {
    

    // Adjust the canvas size to be within wall boundaries
    const adjustedWidth = canvas.width - 2 * wallThickness;
    const adjustedHeight = canvas.height - 2 * wallThickness;

    // Calculate the position of the food so it's on the grid and within the walls
    food = {
        x: Math.floor(Math.random() * (adjustedWidth / gridSize)) * gridSize + wallThickness,
        y: Math.floor(Math.random() * (adjustedHeight / gridSize)) * gridSize + wallThickness
    };

    // Ensure the food coordinates are rounded to the nearest multiple of gridSize
    food.x = Math.round(food.x / gridSize) * gridSize;
    food.y = Math.round(food.y / gridSize) * gridSize;

    // Check if food is spawned on the snake or on the walls
    if (isFoodOnSnake(food) || isFoodOnWall(food, wallThickness)) {
        createFood();  // Recreate the food if it's on the snake or wall
    }
}

function isFoodOnSnake(food) {
    return snake.some(function(part) {
        return part.x === food.x && part.y === food.y;
    });
}

function isFoodOnWall(food, wallThickness) {
    // Check if food is directly on the wall
    return (
        food.x < wallThickness || 
        food.y < wallThickness || 
        food.x >= canvas.width - wallThickness || 
        food.y >= canvas.height - wallThickness
    );
}






function drawSnake() {
    snake.forEach(function(snakePart, index) {
        // Use the snake image for each part of the snake
        ctx.drawImage(snakeImage, snakePart.x, snakePart.y, grid, grid);
    });
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            checkAndUpdateHighScore();
            return true;
        }
    }
    return false;
}
function handleGameOver() {
    gameOverSound.play();
    backgroundMusic.pause();
    restartButton.style.display = 'block'; // Show Restart button
    gameInProgress = false;
    updateScoreAndLives();
}

function updateScoreAndLives() {
    const address = sessionStorage.getItem('walletAddress');
    
    // Update score
    fetch(`https://psychic-chainsaw-production.up.railway.app/updateScore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address, score }) // Use the 'address' variable here
    }).catch(error => console.error('Error updating score:', error));

    // Decrement lives by 1
    fetch(`https://psychic-chainsaw-production.up.railway.app/updateLives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address, livesChange: -1 }) // And also here
    })
    .then(response => response.json())
    .then(data => {
        updateLivesDisplay(data.lives);
        document.getElementById('livesCount').innerText = data.lives;
    })
    .catch(error => console.error('Error updating lives:', error));
}



function drawWalls() {
    ctx.strokeStyle = '#970505';
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40;
    const W_KEY = 87, A_KEY = 65, S_KEY = 83, D_KEY = 68;

    const goingUp = dy === -grid;
    const goingDown = dy === grid;
    const goingRight = dx === grid;
    const goingLeft = dx === -grid;

    if (goingDown && (keyPressed === UP_KEY || keyPressed === W_KEY)) {
        // Ignore up key or W key when going down
        return;
    }

    if (goingUp && (keyPressed === DOWN_KEY || keyPressed === S_KEY)) {
        // Ignore down key or S key when going up
        return;
    }

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        dx = -grid;
        dy = 0;
    } else if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;
        dy = -grid;
    } else if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = grid;
        dy = 0;
    } else if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;
        dy = grid;
    }
}

// Other functions like clearCanvas, drawFood, advanceSnake, drawSnake, didGameEnd, etc. remain the same

// Add touch controls for mobile responsiveness
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && dx === 0) { dx = -grid; dy = 0; } // Left swipe
        else if (xDiff < 0 && dx === 0) { dx = grid; dy = 0; } // Right swipe
    } else {
        if (yDiff > 0 && dy === 0) { dy = -grid; dx = 0; } // Up swipe
        else if (yDiff < 0 && dy === 0) { dy = grid; dx = 0; } // Down swipe
    }

    xDown = null;
    yDown = null;
};

// Use local storage to save and display high scores
function saveHighScore(score) {
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        // Display the new high score
    }
    function handleError(error) {
        console.error('An error occurred:', error);
        // Display error to the user or take appropriate actions
    }
    
}
function checkAndUpdateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
    function handleError(error) {
        console.error('An error occurred:', error);
        // Display error to the user or take appropriate actions
    }
    
}
function updateLeaderboard() {
    fetch('https://psychic-chainsaw-production.up.railway.app/leaderboard')
        .then(response => response.json())
        .then(leaderboardData => {
            let leaderboardHTML = '';
            leaderboardData.forEach(player => {
                leaderboardHTML += `<p>${player.address}: ${player.score}</p>`;
            });
            document.getElementById('leaderboard').innerHTML = leaderboardHTML;
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}
function updateLives(lives) {
    document.getElementById('livesCount').innerText = lives;
}
function checkLivesAndStartGame() {
    const walletAddress = sessionStorage.getItem('walletAddress');
    if (!walletAddress) {
        alert("Please connect your wallet to play.");
        window.location.href = 'index.html'; // Redirect to homepage if no wallet is connected
        return;
    }

    fetch(`https://psychic-chainsaw-production.up.railway.app/getLives?address=${walletAddress}`)
        .then(response => response.json())
        .then(data => {
            updateLivesDisplay(data.lives);
            
            try {
                console.log("Lives data received:", data);
                if (data.lives > 0) {
                    startGame(); // Function that starts the game
                } else {
                    alert("You have no lives left. Share on Twitter for more lives!");
                    // Logic to direct the user to get more lives (e.g., show Twitter share button)
                }
                
            } catch (error) {
                console.error('Error processing lives data:', error);
                alert('Error processing lives. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error checking lives:', error);
            alert('Error checking lives. Please try again.');
            window.location.href = 'index.html'; // Redirect to homepage on error
        });
}



// Update this whenever lives change


// Call this function at appropriate times, such as after each game

document.addEventListener("keydown", changeDirection);
// Load and display the high score on game start


// Comment or remove auto-start game loop
// main(); // This will now be started by the Start button

// Optionally, start the background music when the game starts
// backgroundMusic.play();

