const playBtn = document.getElementById("play-btn");
const hitBtn = document.getElementById("hit-btn");
const stayBtn = document.getElementById("stay-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");

let playerCardDisplay = document.getElementById("display-player-cards");
let dealerCardDisplay = document.getElementById("display-dealer-cards");
let playerSplitCardDisplay = document.getElementById("display-player-split-cards");

let faceDownCardImage = document.createElement('img');

let dealerHand = new Hand();
let playerHand1 = new Hand();
let playerHand2 = new Hand();

const deck = new Deck();

let faceDownCard;

dealerHand.cardDisplay = dealerCardDisplay;
playerHand1.cardDisplay = playerCardDisplay;
playerHand2.cardDisplay = playerSplitCardDisplay;



function drawFaceDownCard() {
    faceDownCard = deck.drawCard();
    dealerHand.addToHand(faceDownCard);

    faceDownCardImage.src = "Images/backOfCard.jpeg";
    faceDownCardImage.style.height = '70px';
    faceDownCardImage.style.width = '50px';
    faceDownCardImage.style.marginLeft = '5px';

    dealerCardDisplay.appendChild(faceDownCardImage);
}

function drawCard(hand) {
    const card = deck.drawCard();
    hand.addToHand(card);

    const img = document.createElement('img');
    img.src = card.imagePath;
    img.style.height = '70px';
    img.style.width = '50px';
    img.style.marginLeft = '5px';
    img.style.marginTop = '5px';

    hand.cardDisplay.appendChild(img);
}

function revealFaceDownCard() {
    faceDownCardImage.src = faceDownCard.imagePath;
    faceDownCardImage.style.marginLeft = '5px';
}

//need to do check for blackjack to work with splits
function checkForBlackjack() {
    if (dealerHand.count === 21 && playerHand1.count !== 21) {
        window.alert("Dealer Blackjack");
        revealFaceDownCard();
    }

    if (playerHand1.count === 21 && dealerHand.count !== 21) {
        window.alert("Player Blackjack");
        revealFaceDownCard();
    }

    if (dealerHand.count === 21 && playerHand1.count === 21) {
        window.alert("Tie");
        revealFaceDownCard();
    }
}

function checkForSplitAllowed() {
    let flag;
    const faceCardCheck = ["J", "Q", "K"];

    if (faceCardCheck.includes(playerHand1.cards[0].numValue[0]) && faceCardCheck.includes(playerHand1.cards[1].numValue[0])) {
        flag = true;
    } else if (faceCardCheck.includes(playerHand1.cards[0].numValue[0]) && playerHand1.cards[1].numValue === "10") {
        flag = true;
    } else if (faceCardCheck.includes(playerHand1.cards[1].numValue[0]) && playerHand1.cards[0].numValue === "10") {
        flag = true;
    } else {
        flag = (playerHand1.cards[0].numValue === playerHand1.cards[1].numValue);
    }

    return flag;
}

function splitHand() {
    playerHand1.selected = true;
    playerCardDisplay.style.backgroundColor = 'limegreen';

    const splitCard = playerHand1.cards[1];
    playerHand2.addToHand(splitCard);

    const img = document.createElement('img');
    img.src = splitCard.imagePath;
    img.style.height = '70px';
    img.style.width = '50px';
    img.style.marginLeft = '5px';
    img.style.marginTop = '5px';

    playerSplitCardDisplay.appendChild(img);

    playerHand1.popFromHand();

    drawCard(playerHand2);
    drawCard(playerHand1);
}

//need to do calculate winner work with splits
function calculateWinner() {
    if (playerHand1.count > 21) {
        revealFaceDownCard();
        setTimeout(window.alert("Player Bust, Dealer Win"), 1000);
    } else if (playerHand1.count <= 21 && dealerHand.count > 21) {
        revealFaceDownCard();
        setTimeout(window.alert("Dealer Bust, Player Win"), 1000);
    } else if (21 - dealerHand.count < 21 - playerHand1.count) {
        revealFaceDownCard();
        setTimeout(window.alert("Dealer Win"), 1000);
    } else if (21 - dealerHand.count > 21 - playerHand1.count) {
        revealFaceDownCard();
        setTimeout(window.alert("Player Win"), 1000);
    } else {
        revealFaceDownCard();
        setTimeout(window.alert("Push"), 1000);
    }
}

function disableButtons() {
    stayBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    splitBtn.disabled = true;
}

function reduceHandAces(hand) {
    for (const card of hand.cards) {
        if (card.numValue === 'Ace') hand.count -= 10;
    }
}

function runDealerTurn() {
    disableButtons();
    revealFaceDownCard();

    while (dealerHand.count < 17) {
        drawCard(dealerHand);
        if (dealerHand.count > 21 && dealerHand.cards.some(card => card.numValue === 'Ace')) {
            reduceHandAces(dealerHand);
        }
    }

    if (dealerHand.count === 17 && dealerHand.cards.some(card => card.numValue === 'Ace')) {
        drawCard(dealerHand);
    }

    calculateWinner();
}

function hit() {
    const isGameSplit = playerHand1.selected || playerHand2.selected;

    if (!isGameSplit) {
        drawCard(playerHand1);
    } else if (playerHand1.selected && !playerHand2.selected) {
        drawCard(playerHand1);
    } else if (!playerHand1.selected && playerHand2.selected) {
        drawCard(playerHand2);
    }

    if (playerHand1.count > 21 && playerHand1.cards.some(card => card.numValue === 'Ace')) {
        reduceHandAces(playerHand1)
    }

    if (playerHand2.count > 21 && playerHand2.cards.some(card => card.numValue === 'Ace')) {
        reduceHandAces(playerHand2);
    }

    if (playerHand1.count < 21) {
        doubleBtn.disabled = true;
        splitBtn.disabled = true;
    } else {
        if (isGameSplit) {
            playerHand1.selected = false;
            playerHand2.selected = true;

            playerCardDisplay.style.backgroundColor = '';
            playerSplitCardDisplay.style.backgroundColor = 'limegreen';
        } else {
            runDealerTurn();
        }
    }

    if (playerHand2.count >= 21) {
        playerSplitCardDisplay.style.backgroundColor = '';
        runDealerTurn();
    }
}

function double() {
    const isGameSplit = playerHand1.selected || playerHand2.selected;

    if (!isGameSplit) {
        drawCard(playerHand1);
        runDealerTurn();
    } else if (isGameSplit && playerHand1.selected) {
        drawCard(playerHand1);

        playerHand1.selected = false;
        playerHand2.selected = true;

        playerCardDisplay.style.backgroundColor = '';
        playerSplitCardDisplay.style.backgroundColor = 'limegreen';
    } else if (isGameSplit && playerHand2.selected) {
        drawCard(playerHand2);
        runDealerTurn();
    }

    if (playerHand1.count > 21 && playerHand1.cards.some(card => card.numValue === 'Ace')) {
        reduceHandAces(playerHand1)
    }

    if (playerHand2.count > 21 && playerHand2.cards.some(card => card.numValue === 'Ace')) {
        reduceHandAces(playerHand2);
    }
}

function stay() {
    if (playerHand1.selected) {
        playerHand1.selected = false;
        playerHand2.selected = true;
        playerCardDisplay.style.backgroundColor = '';
        playerSplitCardDisplay.style.backgroundColor = 'limegreen';
    } else {
        runDealerTurn();
    }
}

function game() {
    playBtn.disabled = true;
    playerHand1.clearHand();
    playerHand2.clearHand();
    dealerHand.clearHand();

    stayBtn.disabled = false;
    hitBtn.disabled = false;
    doubleBtn.disabled = false;

    drawFaceDownCard();
    drawCard(playerHand1);
    drawCard(dealerHand);
    drawCard(playerHand1);

    checkForSplitAllowed() ? splitBtn.disabled = false : splitBtn.disabled = true;

    checkForBlackjack();

    hitBtn.addEventListener("click", hit);
    doubleBtn.addEventListener("click", double);
    stayBtn.addEventListener("click", stay);

    splitBtn.addEventListener("click", () => {
        splitBtn.disabled = true;
        splitHand();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    playBtn.addEventListener("click", game);
});