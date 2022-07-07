"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple", "yellow", "brown", 
  "red", "blue", "green", "orange", "purple", "yellow", "brown",
];

const colors = shuffle(COLORS);

createCards(colors);
loadTopScore();
function loadTopScore() {
  document.querySelector('#top').innerText = localStorage.getItem('playerOneScore');
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let i = 0; i < colors.length; i++) {
    let cardMaker = createCard(colors[i], i); //created a card
    gameBoard.appendChild(cardMaker);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  // card.style.backgroundColor = card.dataset.cardValue;
  let colorBackCard = card.dataset.cardValue;
  card.style.backgroundImage = `url('/photos/${colorBackCard}.gif')`;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundImage = "url('/photos/front.jpg')";
}

/** Handle clicking on a card: this could be first-card or second-card. */
let cardArr = [];
let matchCount = 0;
let done = false;
let isBlocked = false;
let maxCount = colors.length / 2;
let nums = 0;

function handleCardClick(evt) {
  if (evt.srcElement.dataset.cardMatched || isBlocked || done) {
    //do nothing when already matched
    return;
  }
  flipCard(evt.srcElement);

  let exists = cardArr.some(function (card) {
    return card.id === evt.srcElement.id;
  });
  if (!exists) {
    cardArr.push(evt.srcElement);
    nums++;
    document.querySelector('#one').innerText = nums;
  }

  if (cardArr.length === 2) {
    isBlocked = true;
    let isMatch = cardArr[0].dataset.cardValue === cardArr[1].dataset.cardValue;

    setTimeout(function () {
      if (!isMatch) {
        unFlipCard(cardArr[0]);
        unFlipCard(cardArr[1]);
      } else {
        markMatch(cardArr[0]);
        markMatch(cardArr[1]);
        checkGame();
      }
      cardArr = [];
      isBlocked = false;
    }, 1000);
  }
}

function checkGame() {
  matchCount++;

  if (matchCount === maxCount) {
    done = true;
    isBlocked = true;
    document.querySelector("h1").innerText = "game over";

    let lowestScore = localStorage.getItem('playerOneScore');

    if (nums < lowestScore) {
      localStorage.setItem('playerOneScore', nums);
      loadTopScore();

    }
  }

}

function createCard(color, id) {
  const newCard = document.createElement("div");
  newCard.id = id;
  newCard.className = "card";
  newCard.setAttribute("data-card-value", color);
  newCard.addEventListener("click", handleCardClick);
  return newCard;
}

function markMatch(card) {
  card.setAttribute("data-card-matched", true);
}


//reset button
document.querySelector('#reset').addEventListener('click', resetGame);
function resetGame() {
  location.reload();
}