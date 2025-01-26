let cards = [];
let flippedCards = [];
let matchedCards = 0;
let score = 0;
let startTime = null;
let elapsedTime = 0;
let timerInterval;
let currentDifficulty = 'easy'; // Default difficulty

// Initialize difficulty levels
const difficultyLevels = {
    easy: 6,   // 6 pairs = 12 cards
    medium: 8, // 8 pairs = 16 cards
    hard: 10   // 10 pairs = 20 cards
};

// Generate cards based on difficulty
function generateCards() {
    let numberOfPairs = difficultyLevels[currentDifficulty];
    let cardValues = [];

    // Fill the array with pairs of numbers
    for (let i = 1; i <= numberOfPairs; i++) {
        cardValues.push(i, i);
    }

    // Shuffle the cards
    cardValues = cardValues.sort(() => Math.random() - 0.5);
    cards = cardValues;
}

// Create the game board
function createGameBoard() {
    const gameBoard = document.getElementById("game");
    gameBoard.innerHTML = ''; // Clear the game board

    // Adjust grid based on difficulty
    const gridColumns = currentDifficulty === 'easy' ? 4 : currentDifficulty === 'medium' ? 4 : 5;
    const gridRows = Math.ceil(cards.length / gridColumns);

    gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 100px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridRows}, 100px)`;

    cards.forEach((value, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-index", index);
        cardElement.addEventListener("click", flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Flip card and check if it's a match
function flipCard() {
    const cardElement = this;
    const cardIndex = parseInt(cardElement.getAttribute("data-index"));
    
    if (flippedCards.length < 2 && !cardElement.classList.contains("flipped") && !cardElement.classList.contains("matched")) {
        cardElement.classList.add("flipped");
        cardElement.textContent = cards[cardIndex];
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Check if the two flipped cards match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstValue = firstCard.textContent;
    const secondValue = secondCard.textContent;

    if (firstValue === secondValue) {
        matchedCards++;
        score += 10;
        updateScore();
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        flippedCards = [];
        if (matchedCards === cards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

// Update the score
function updateScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Start the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById("timer").textContent = `Time: ${elapsedTime}`;
    }, 100);
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    document.getElementById("gameOver").style.display = "block";
}

// Reset the game (shuffle cards, reset score, etc.)
function resetGame() {
    matchedCards = 0;
    score = 0;
    elapsedTime = 0;
    updateScore();
    document.getElementById("gameOver").style.display = "none";
    startTimer();
    generateCards();
    createGameBoard();
}

// Set difficulty level
function setDifficulty(level) {
    currentDifficulty = level;
    resetGame(); // Reset the game after selecting difficulty
}

// Initialize the game on page load
window.onload = function () {
    resetGame();
};
