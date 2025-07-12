// Array of emojis to use for card faces
const allEmojis = [
  '🍈','🍌','🍇','🍓','🍉','🍒','🥝','🍍',
  '🥥','🍑','🍋','🍊','🍐','🍈','🍏',
  '🍅','🍆','🥑','🥕','🌽','🥔','🧄','🧅',
  '🥬','🥦','🌶️','🥒','🍄','🌰','🥜','🍞',
  '🧀','🍗','🍖','🥩','🥓','🍔','🍟','🍕',
  '🌭','🥪','🌮','🌯','🥙','🧆','🥚','🍳',
  '🥞','🧇','🍝','🍜','🍲','🍥','🥠','🍘',
  '🍙','🍚','🍛','🍢','🍡','🍧','🍨','🍦',
  '🥧','🍰','🎂','🍮','🍭','🍬','🍫','🍿',
  '🍩','🍪'
];

// DOM elements
const board = document.getElementById('gameBoard');
const winModal = document.getElementById('winModal');
const thanksModal = document.getElementById('thanksModal');
const finalTimeText = document.getElementById('finalTime');
const timerDisplay = document.getElementById('timer');

// Game state variables
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let timerInterval;
let startTime;

// Difficulty configurations with grid sizes
const gridSizes = {
  easy: { rows: 2, cols: 4 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 5, cols: 18 },
  impossible: { rows: 2, cols: 2 }
};

/* Start the game */
function startGame(difficulty) {
  // Hide menu and show game board
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';

  // Start background music
  const music = document.getElementById('backgroundMusic');
  music.volume = 0.2;
  music.play();

  // Get rows and columns for chosen difficulty
  const { rows, cols } = gridSizes[difficulty];
  board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

  // Calculate total pairs needed
  totalPairs = (rows * cols) / 2;

  // Select emojis and duplicate for pairs
  const selectedEmojis = allEmojis.slice(0, totalPairs);
  const cards = [...selectedEmojis, ...selectedEmojis];

  // Shuffle the cards using random sort
  cards.sort(() => 0.5 - Math.random());

  // Reset game state
  board.innerHTML = '';
  matchedPairs = 0;
  flippedCards = [];

  // Generate card elements and add to DOM
  cards.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">${icon}</div>
      </div>
    `;

    // Add click event to handle flipping and matching logic
    card.addEventListener('click', () => {
      if (card.classList.contains('flipped') || flippedCards.length === 2) return;

      card.classList.add('flipped');
      flippedCards.push(card);

      // Check for match if two cards are flipped
      if (flippedCards.length === 2) {
        const [first, second] = flippedCards;
        const firstIcon = first.querySelector('.card-front').textContent;
        const secondIcon = second.querySelector('.card-front').textContent;

        if (firstIcon === secondIcon) {
          // Match found
          matchedPairs++;
          flippedCards = [];

          // Check if game is won
          if (matchedPairs === totalPairs) {
            stopTimer();
            setTimeout(() => {
              finalTimeText.textContent = `You finished in ${getElapsedTime()} seconds!`;
              winModal.style.display = 'flex';
            }, 500);
          }
        } else {
          // No match: flip back after 1 second
          setTimeout(() => {
            first.classList.remove('flipped');
            second.classList.remove('flipped');
            flippedCards = [];
          }, 1000);
        }
      }
    });

    board.appendChild(card);
  });

  // Start the game timer
  startTimer();
}

/* Play again or quit */
function playAgain(choice) {
  if (choice) {
    // Reset game and show menu again
    winModal.style.display = 'none';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('menu').style.display = 'block';

    stopTimer();
    document.getElementById('timeValue').textContent = '0';
    board.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    totalPairs = 0;
  } else {
    // Show thank-you message and fade out
    winModal.style.display = 'none';
    thanksModal.style.display = 'flex';
    setTimeout(() => {
      thanksModal.style.display = 'none';
      document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:20%'>Thanks for playing! 👋</h1>";
    }, 2000);
  }
}

/* Start the timer */
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timeValue').textContent = seconds;
  }, 1000);
}

/* Stop the timer */
function stopTimer() {
  clearInterval(timerInterval);
}

/* Get the number of seconds elapsed */
function getElapsedTime() {
  return Math.floor((Date.now() - startTime) / 1000);
}

/* ✅ Recursion: flatten any nested array structure */
function flattenArray(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
}

// Demo for recursive flattening (visible in console)
console.log("Recursive Flatten Test:", flattenArray([1, [2, [3, [4]]]]));
