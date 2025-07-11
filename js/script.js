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

const board = document.getElementById('gameBoard');
const winModal = document.getElementById('winModal');
const thanksModal = document.getElementById('thanksModal');
const finalTimeText = document.getElementById('finalTime');
const timerDisplay = document.getElementById('timer');

let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let timerInterval;
let startTime;

const gridSizes = {
  easy: { rows: 2, cols: 4 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 5, cols: 18 },
  impossible: { rows: 2, cols: 2 }
};

function startGame(difficulty) {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';

  const music = document.getElementById('backgroundMusic');
  music.volume = 0.2;
  music.play();

  const { rows, cols } = gridSizes[difficulty];
  board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

  totalPairs = (rows * cols) / 2;

  const selectedEmojis = allEmojis.slice(0, totalPairs);
  const cards = [...selectedEmojis, ...selectedEmojis];
  cards.sort(() => 0.5 - Math.random());

  board.innerHTML = '';
  matchedPairs = 0;
  flippedCards = [];

  cards.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">${icon}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      if (card.classList.contains('flipped') || flippedCards.length === 2) return;

      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        const [first, second] = flippedCards;
        const firstIcon = first.querySelector('.card-front').textContent;
        const secondIcon = second.querySelector('.card-front').textContent;

        if (firstIcon === secondIcon) {
          matchedPairs++;
          flippedCards = [];
          if (matchedPairs === totalPairs) {
            stopTimer();
            setTimeout(() => {
              finalTimeText.textContent = `You finished in ${getElapsedTime()} seconds!`;
              winModal.style.display = 'flex';
            }, 500);
          }
        } else {
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

  startTimer();
}

function playAgain(choice) {
  if (choice) {
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
    winModal.style.display = 'none';
    thanksModal.style.display = 'flex';
    setTimeout(() => {
      thanksModal.style.display = 'none';
      document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:20%'>Thanks for playing! 👋</h1>";
    }, 2000);
  }
}


function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timeValue').textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function getElapsedTime() {
  return Math.floor((Date.now() - startTime) / 1000);
}
