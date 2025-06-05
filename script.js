const usernameInput = document.getElementById('username');
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-game');
const difficultySelect = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');

let cards = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let countdown; 
let timeElapsed = 0;

startButton.addEventListener('click', startGame);


function startGame() {
    timeElapsed = 0;
    const username = usernameInput.value.trim();
    const difficulty = difficultySelect.value;
    initializeGame(difficulty);
}


function initializeGame(difficulty) {
    resultDisplay.textContent = "";
    gameBoard.classList.remove('hidden');
    cards = generateCards(difficulty);
    displayCards();
    flippedCards = [];
    matchedCards = [];

    if (difficulty === 'easy') {
        showAllCardsTemporarily();
    }

    startTimer(difficulty);
}


function generateCards(difficulty) {
    let cardCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
    const pairs = Array.from({ length: cardCount / 2 }, (_, i) => i + 1);
    const cardValues = [...pairs, ...pairs];
    return shuffle(cardValues);
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


function displayCards() {
    gameBoard.innerHTML = '';
    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.textContent = '';
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}


function showAllCardsTemporarily() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, index) => {
        card.textContent = cards[index];
        card.style.backgroundColor = '#28a745';
    });

    setTimeout(() => {
        allCards.forEach((card) => {
            card.textContent = '';
            card.style.backgroundColor = '';
        });
    }, 2000);
}


function startTimer(difficulty) {
    let seconds = 0;

    clearInterval(timer); 
    clearInterval(countdown); 

    if (difficulty === 'hard') {
        let timeLeft = 20; 
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        countdown = setInterval(() => {
            timeLeft--;
            timeElapsed++;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                endGame(false); 
            }
        }, 1000);
    } else {
        timer = setInterval(() => {
            seconds++;
            timeElapsed ++;
            timerDisplay.textContent = `Time: ${seconds}s`;
        }, 1000);
    }
}


function flipCard() {
    const index = this.dataset.index;
    if (flippedCards.length < 2 && !this.textContent) {
        this.textContent = cards[index];
        this.style.backgroundColor = '#007bff';
        flippedCards.push({ index, value: cards[index] });

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 500);
        }
    }
}


function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.value === card2.value) {
        matchedCards.push(card1.index, card2.index);
    } else {
        document.querySelector(`[data-index="${card1.index}"]`).textContent = '';
        document.querySelector(`[data-index="${card2.index}"]`).textContent = '';
    }

    flippedCards = [];

    
    if (matchedCards.length === cards.length) {
        clearInterval(countdown); 
        clearInterval(timer); 
        endGame(true); 
    }
}


function endGame(won) {
    clearInterval(timer);
    if (won) {
        resultDisplay.textContent = `Congratulations! You completed the game in ${timeElapsed}s.`;
        saveScore();
    } else {
        resultDisplay.textContent = `Time is up! You lost. Try again!`;
    }
    resultDisplay.classList.remove('hidden');
    resetGame();
}


function resetGame() {
    gameBoard.innerHTML = '';
    timerDisplay.textContent = '';
    matchedCards = [];
    flippedCards = [];
    cards = [];
}

function saveScore() {
    const name = usernameInput.value;
    const difficulty = difficultySelect.value;

    fetch('http://localhost:3000/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, difficulty, time: timeElapsed })
    });
}
