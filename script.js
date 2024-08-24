// The following variables below are all the sound variables and mute/unmute fucntions 
let backgroundMusic = new Audio();
backgroundMusic.src = "sounds/bg-music.mp3";
let backgroundMusicStatus = 0;
let backgroundMusicInterval;

function playBackgroundMusic() {
    backgroundMusic.play();
    if (backgroundMusicStatus == 1) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = 0.5;
    }
}

function muteBackgroundMusic() {
    const muteBtnImg = document.getElementById("mute-btn-img");
    if (backgroundMusicStatus == 0) {
        muteBtnImg.setAttribute("src", "assets/header/mute.png");
        backgroundMusic.volume = 0;
        backgroundMusicStatus++;
    } else {
        muteBtnImg.setAttribute("src", "assets/header/unmute.png");
        backgroundMusic.volume = 0.5;
        backgroundMusicStatus--;
    }
}

document.getElementById("mute-header-btn").addEventListener("click", muteBackgroundMusic)
//END HERE

// The following lines of codes are for the swipe card to start
const cardSlot = document.querySelector('.card-slot');
const swipeCard = document.getElementById('swipe-card');
let startX = 0;
let currentX = 0;
let isSwiping = false;
let cardSlotWidth = cardSlot.offsetWidth; 

// Event Listeners for Swipe Actions
swipeCard.addEventListener('mousedown', startSwipe);
swipeCard.addEventListener('touchstart', startSwipe);
swipeCard.addEventListener('mousemove', swipeMove);
swipeCard.addEventListener('touchmove', swipeMove);
swipeCard.addEventListener('mouseup', endSwipe);
swipeCard.addEventListener('touchend', endSwipe);
window.addEventListener('resize', updateCardSlotWidth);

// Swipe Functions
function updateCardSlotWidth() {
    cardSlotWidth = cardSlot.offsetWidth;
}

function startSwipe(event) {
    isSwiping = true;
    startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function swipeMove(event) {
    if (!isSwiping) return;

    currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX > 1) {  // Swiping to the right
        swipeCard.style.transform = `translateX(${deltaX}px)`;
    }

    // Check if swipe reached the threshold
    if (Math.abs(deltaX) > (cardSlotWidth/1.3) && isSwiping == true) {
        isSwiping = false;
        startCardInterval();
    }
    
}

function endSwipe() {
    isSwiping = false;
    swipeCard.style.transform = 'translateX(0)';
}
//END HERE

// The following lines of codes include all of the functions and variables needed for you to transition from the start screen to the game board
let startScreenTimer;
let timer;
let timeRemaining = 30;

function startCardInterval() {
    hideStartScreen();
    newLevel();
    resetBoard();
}

function hideStartScreen() {
    document.getElementById("start-screen").style.display = "none";
    playBackgroundMusic();
    backgroundMusicInterval = setInterval(playBackgroundMusic, 120000);
}
// END HERE

// The following lines of codes hides all the header and gameboard elements, and shows the end message
function endGame(){
    score
    document.getElementById("game-board").style.display = "none"
    document.getElementById("header").style.display = "none"
    clearInterval(backgroundMusicInterval)
    backgroundMusic.volume = 0
    backgroundMusicStatus = 1
    if (score >= 7){
        document.getElementById("pass-end-screen").style.display = "flex"
    } else {
        document.getElementById("fail-end-screen").style.display = "flex"
    }
}
// END HERE

// GAME FUNCTIONS PROPER

let levelPrompt = document.getElementById("game-level-title")
let questionPrompt = document.getElementById("game-level-text")

const stationLevel = [
    ["STATION 1", "The proper term to refer to people with hearing loss."], 
    ["STATION 2", "The type of barriers that affect interaction and independence."],
    ["STATION 3", "Providing equal access to opportunities to everyone regardless of their condition."],
    ["STATION 4", "A type of inclusivity that believes male and female stereotypes do not define societal roles and expectations."],
    ["STATION 5", "The undergraduate program that enables deaf students to be true leader-advocates."],
    ["STATION 6", "Through the CIE, they are given equal and effective opportunities."],
    ["STATION 7", "The leading learner-centered educational institution in Deaf education."],
    ["STATION 8", "R.A. 9710 is dedicated to this group of people to annihilate discrimination."],
    ["STATION 9", "Along with dignity, it is what DLS-CSB aspires to uphold for all persons."],
    ["STATION 10", "An example of digital and printed publications used by the CIE to promote Benildean inclusions."]
]

function newLevel() {
    levelPrompt.innerHTML = stationLevel[currentLevel][0]
    questionPrompt.innerHTML = stationLevel[currentLevel][1]
}

const gridSize = 6;
let clickedLetters = [];
let clickedPositions = [];
let currentLevel = 0;
let allowedDirection = null;
const buttonStates = {};
let score = 0;


const wordsToFind = ["DEAF", "SOCIAL", "EQUITY", "GENDER", "CDEAF", "PWD", "SDEAS", "WOMEN", "RIGHTS", "PHOTO"];

function getRandomLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
}

function placeWordOnGrid(word) {
    const direction = Math.floor(Math.random() * 3);
    let startRow, startCol;

    switch (direction) {
        case 0: // Horizontal
            startRow = Math.floor(Math.random() * gridSize);
            startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
                document.getElementById(`grid-button-${startRow * gridSize + startCol + i + 1}`).innerText = word[i];
            }
            break;
        case 1: // Vertical
            startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
            startCol = Math.floor(Math.random() * gridSize);
            for (let i = 0; i < word.length; i++) {
                document.getElementById(`grid-button-${(startRow + i) * gridSize + startCol + 1}`).innerText = word[i];
            }
            break;
        case 2: // Diagonal
            startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
            startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
                document.getElementById(`grid-button-${(startRow + i) * gridSize + startCol + i + 1}`).innerText = word[i];
            }
            break;
    }
}

function resetBoard() {
    clearInterval(timer);
    timeRemaining = 30;
    startTimer();

    clickedLetters = [];
    clickedPositions = [];
    allowedDirection = null;
    for (let i = 1; i <= gridSize * gridSize; i++) {
        document.getElementById(`grid-button-${i}`).innerText = getRandomLetter();
        buttonStates[i] = false;
        document.getElementById(`grid-button-${i}`).style.backgroundColor = "white";
    }

    if (currentLevel < wordsToFind.length) {
        const currentWord = wordsToFind[currentLevel];
        placeWordOnGrid(currentWord);
    } else {
        endGame();
    }
}

function resetLevel() {
    alert("Invalid move! The board will reset to the current level.");
    
    clickedLetters = [];
    clickedPositions = [];
    allowedDirection = null;
    for (let i = 1; i <= gridSize * gridSize; i++) {
        document.getElementById(`grid-button-${i}`).innerText = getRandomLetter();
        buttonStates[i] = false;
        document.getElementById(`grid-button-${i}`).style.backgroundColor = "white";
    }
    
    if (currentLevel < wordsToFind.length) {
        const currentWord = wordsToFind[currentLevel];
        placeWordOnGrid(currentWord);
    }
}

function determineDirection(startPos, nextPos) {
    const startRow = Math.floor((startPos - 1) / gridSize);
    const startCol = (startPos - 1) % gridSize;
    const nextRow = Math.floor((nextPos - 1) / gridSize);
    const nextCol = (nextPos - 1) % gridSize;

    if (startRow === nextRow) {
        return "horizontal";
    } else if (startCol === nextCol) {
        return "vertical";
    } else if (Math.abs(startRow - nextRow) === Math.abs(startCol - nextCol)) {
        return "diagonal";
    }
    return null;
}

function isMoveAllowed(newPos) {
    const newDirection = determineDirection(clickedPositions[0], newPos);

    if (allowedDirection === null) {
        allowedDirection = newDirection;
        return true;
    }

    return allowedDirection === newDirection;
}

function isAdjacent(lastPos, newPos) {
    const lastRow = Math.floor((lastPos - 1) / gridSize);
    const lastCol = (lastPos - 1) % gridSize;
    const newRow = Math.floor((newPos - 1) / gridSize);
    const newCol = (newPos - 1) % gridSize;

    return (
        Math.abs(lastRow - newRow) <= 1 &&
        Math.abs(lastCol - newCol) <= 1 &&
        !(lastRow === newRow && lastCol === newCol)
    );
}

function handleClick(buttonId) {
    const button = document.getElementById(buttonId);
    const letter = button.innerText;
    const buttonIndex = parseInt(buttonId.split('-')[2]);

    if (buttonStates[buttonIndex]) { // Unclick
        const lastClickedIndex = clickedPositions.pop();
        clickedLetters.pop();
        buttonStates[buttonIndex] = false;
        button.style.backgroundColor = "white";

        if (clickedPositions.length < 2) {
            allowedDirection = null;
        }
    } else { // Click
        if (clickedPositions.length === 0 || isAdjacent(clickedPositions[clickedPositions.length - 1], buttonIndex)) {
            if (clickedPositions.length > 0 && !isMoveAllowed(buttonIndex)) {
                resetLevel();
            } else {
                clickedLetters.push(letter);
                clickedPositions.push(buttonIndex);
                buttonStates[buttonIndex] = true;
                button.style.backgroundColor = "#BF3D26";
            }
        } else {
            resetLevel();
        }
    }
}

function checkForWord(currentWord) {
    const currentWordToFind = wordsToFind[currentLevel];

    // If it's the last round, end the game regardless of the word's correctness
    if (currentLevel === wordsToFind.length - 1) {
        if (currentWord === currentWordToFind) {
            score++;
            document.getElementById("game-level-score").innerText = "Score: " + score;
        }
        endGame();
        return;
    }

    // For rounds before the last one
    if (currentWord === currentWordToFind) {
        alert(`You found the word: ${currentWord}!`);
        score++;
        document.getElementById("game-level-score").innerText = "Score: " + score;
    } else {
        alert("That's not the correct word. Moving to the next level.");
    }

    // Move to the next level if there are more levels remaining
    currentLevel++;
    if (currentLevel < wordsToFind.length) {
        resetBoard();
        newLevel();
    }
}






function startTimer() {
    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {
        timeRemaining--;
        document.getElementById("game-level-time").innerText = "TIME: " + timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert("Time's up! Moving to the next level.");

            currentLevel++;
            if (currentLevel >= wordsToFind.length) {
                endGame();
            } else {
                newLevel();
                resetBoard();
            }
        }
    }, 1000);
}


for (let i = 1; i <= gridSize * gridSize; i++) {
    let button = document.getElementById(`grid-button-${i}`);
    button.addEventListener('click', function () {
        handleClick(`grid-button-${i}`);
    });
}

const submitButton = document.getElementById("game-submit-btn");
submitButton.addEventListener('click', function () {
    if (currentLevel >= wordsToFind.length - 1) { // If it's the last level
        checkForWord(clickedLetters.join(""));
        endGame();
    } else {
        checkForWord(clickedLetters.join(""));
        clickedLetters = [];
        clickedPositions = [];
        allowedDirection = null;
        for (let i = 1; i <= gridSize * gridSize; i++) {
            let button = document.getElementById(`grid-button-${i}`);
            button.style.backgroundColor = "white";
            buttonStates[i] = false;
        }
    }
});


// GAME FUNCTIONS PROPER

function startGame(){
    hideStartScreen()
}