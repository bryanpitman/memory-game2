"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


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
  card.style.backgroundColor = card.dataset.cardValue;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = "white";
}

/** Handle clicking on a card: this could be first-card or second-card. */
let cardArr = [];
let matchCount = 0;
let done = false;
let maxCount = colors.length / 2;
function handleCardClick(evt) {
  if(evt.srcElement.dataset.cardMatched){
    //do nothing when already matched 
    return
  }
  flipCard(evt.srcElement);
  cardArr.push(evt.srcElement);

  if (cardArr.length === 2) {
    let isMatch = cardArr[0].dataset.cardValue === cardArr[1].dataset.cardValue;


    setTimeout(function () {
      if (!isMatch) {
        unFlipCard(cardArr[0]);
        unFlipCard(cardArr[1]);
      } else {
        markMatch(cardArr[0])
        markMatch(cardArr[1])
        checkGame();

      }
      cardArr = [];
    }, 1000);
  }

}

function checkGame() {
  matchCount++;
  if (matchCount === maxCount) {
    done = true;
    document.querySelector("h1").innerText = "game over";
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