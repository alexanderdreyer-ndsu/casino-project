const playBtn = document.getElementById("play-btn");
const hitBtn = document.getElementById("hit-btn");
const stayBtn = document.getElementById("stay-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");

let playerCardDisplay = document.getElementById("display-player-cards");
let dealerCardDisplay = document.getElementById("display-dealer-cards");
let playerSplitCardDisplay = document.getElementById("display-player-split-cards");
let displayGameInfo = document.getElementById("game-output-display");

let faceDownCardImage = document.createElement('img');

let dealerHand = new Hand();
let playerHand1 = new Hand();
let playerHand2 = new Hand();

let shoe = new Shoe(6);

let faceDownCard;
let didPlayerSplitCards = playerHand2.cards.length !== 0;

dealerHand.cardDisplay = dealerCardDisplay;
playerHand1.cardDisplay = playerCardDisplay;
playerHand2.cardDisplay = playerSplitCardDisplay;

function drawFaceDownCard() {
    faceDownCard = shoe.drawCard();
    dealerHand.addToHand(faceDownCard);

    faceDownCardImage.src = "Images/backOfCard.jpeg";
    faceDownCardImage.className = "game-cards slideInTop";

    dealerCardDisplay.appendChild(faceDownCardImage);

    reduceHandAces(dealerHand);
}

function drawCard(hand) {
    const card = shoe.drawCard();
    hand.addToHand(card);

    const img = document.createElement('img');
    img.src = card.imagePath;
    img.className = "game-cards slideInTop";

    hand.cardDisplay.appendChild(img);
}

function endGame() {
    faceDownCardImage.src = faceDownCard.imagePath;

    disableButtons();
    calculateWinner();

    setTimeout(() => { playBtn.disabled = false }, 1000);
}

function checkForBlackjack() {
    const isDealerBlackjack = dealerHand.count === 21;
    const isPlayerBlackjack = playerHand1.count === 21;

    if (didPlayerSplitCards) {
        const isPlayer2Blackjack = playerHand2.count === 21;

        if (isPlayerBlackjack && isPlayer2Blackjack) {
            displayGameInfo.innerText = "Player Hand 1 Blackjack, Player Hand 2 Blackjack";

            endGame();
        } else if (isPlayerBlackjack) {
            stay();

            displayGameInfo.innerText = "Player Hand 1 Blackjack";
        } else if (isPlayer2Blackjack) {
            playerHand1.selected = false;
            playerHand2.selected = false;

            displayGameInfo.innerText = "Player Hand 2 Blackjack";
        }
    } else {
        if (isDealerBlackjack) {
            displayGameInfo.innerText = `${isPlayerBlackjack ? "Push" : "Dealer Blackjack"}`;

            endGame();
        } else if (isPlayerBlackjack) {
            displayGameInfo.innerText = "Player Blackjack";

            endGame();
        }
    }
}

function checkForSplitAllowed(hand) {
    let flag;
    const faceCardCheck = ["Jack", "Queen", "King"];

    if (faceCardCheck.includes(hand.cards[0].numValue) && faceCardCheck.includes(hand.cards[1].numValue)) {
        flag = true;
    } else if ((faceCardCheck.includes(hand.cards[0].numValue)) && hand.cards[1].numValue === "10") {
        flag = true;
    } else if ((faceCardCheck.includes(hand.cards[1].numValue)) && hand.cards[0].numValue === "10") {
        flag = true;
    } else {
        flag = (hand.cards[0].numValue === hand.cards[1].numValue);
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
    img.className = "game-cards";

    playerSplitCardDisplay.appendChild(img);

    playerHand1.popFromHand();

    drawCard(playerHand2);
    drawCard(playerHand1);
}

function calculateWinner() {
    const dealerScore = dealerHand.count <= 21 ? dealerHand.count : 0;
    const playerScore = playerHand1.count <= 21 ? playerHand1.count : -1;

    if (didPlayerSplitCards) {
        const player2Score = playerHand2.count <= 21 ? playerHand2.count : -1;
        let dealerVsPlayer1Message;
        let dealerVsPlayer2Message;

        if (dealerScore !== playerScore) {
            dealerVsPlayer1Message = dealerScore > playerScore ? "Dealer Win Hand 1" : "Player Win Hand 1";
        } else {
            dealerVsPlayer1Message = "Push";
        }

        if (dealerScore !== player2Score) {
            dealerVsPlayer2Message = dealerScore > player2Score ? "Dealer Win Hand 2" : "Player Win Hand 2";
        } else {
            dealerVsPlayer2Message = "Push";
        }

        return displayGameInfo.innerText = `${dealerVsPlayer1Message}, ${dealerVsPlayer2Message}`;
    } else {
        if (dealerScore !== playerScore) return displayGameInfo.innerText = `${dealerScore > playerScore ? "Dealer Win" : "Player Win"}`;

        displayGameInfo.innerText = "Push";
    }
}

function disableButtons() {
    stayBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    splitBtn.disabled = true;
}

function reduceHandAces(hand) {
    if (hand.count > 21) {
        for (const card of hand.cards) {
            if (card.numValue === 'Ace') hand.count -= 10;
        }
    }
}

function runDealerTurn() {
    endGame();

    if (dealerHand.count === 22) {
        reduceHandAces(dealerHand);
    }

    while (dealerHand.count < 17) {
        drawCard(dealerHand);
        reduceHandAces(dealerHand);
    }

    if (dealerHand.count === 17 && dealerHand.cards.some(card => card.numValue === 'Ace')) {
        drawCard(dealerHand);
    }
}

function hit() {
    if (playerHand1.selected && playerHand1.count < 21) drawCard(playerHand1);

    if (playerHand2.selected && playerHand2.count < 21) drawCard(playerHand2);

    reduceHandAces(playerHand1);
    reduceHandAces(playerHand2);

    if (playerHand1.count < 21) {
        doubleBtn.disabled = true;
        splitBtn.disabled = true;
    } else {
        if (didPlayerSplitCards) {
            playerHand1.selected = false;
            playerHand2.selected = true;

            doubleBtn.disabled = false;

            playerCardDisplay.style.backgroundColor = null;
            playerSplitCardDisplay.style.backgroundColor = 'limegreen';
        } else {
            endGame();
        }
    }
}

function double() {
    playerHand1.selected ? drawCard(playerHand1) : drawCard(playerHand2);

    reduceHandAces(playerHand1);
    reduceHandAces(playerHand2);

    if (didPlayerSplitCards) {
        playerHand1.selected = false;
        playerHand2.selected = true;

        playerCardDisplay.style.backgroundColor = null;
        playerSplitCardDisplay.style.backgroundColor = 'limegreen';

        playerHand1.count >= 21 && playerHand2.count >= 21 ? endGame() : runDealerTurn();
    }

    playerHand1.count >= 21 ? endGame() : runDealerTurn();
}

function stay() {
    if (playerHand1.selected && didPlayerSplitCards) {
        playerHand1.selected = false;
        playerHand2.selected = true;

        doubleBtn.disabled = false;

        playerCardDisplay.style.backgroundColor = null;
        playerSplitCardDisplay.style.backgroundColor = 'limegreen';
    } else {
        runDealerTurn();
    }
}

function split() {
    splitBtn.disabled = true;
    didPlayerSplitCards = true;

    splitHand();
    checkForBlackjack();
}

function game() {
    displayGameInfo.innerText = "";

    dealerHand.clearHand();
    playerHand1.clearHand();
    playerHand2.clearHand();

    playBtn.disabled = true;

    playerHand1.selected = true;
    playerHand2.selected = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = null;

    drawFaceDownCard();

    setTimeout(() => {
        drawCard(playerHand1);
    }, 1000);

    setTimeout(() => {
        drawCard(dealerHand);
    }, 1500);

    setTimeout(() => {
        drawCard(playerHand1);

        checkForSplitAllowed(playerHand1) ? splitBtn.disabled = false : splitBtn.disabled = true;

        hitBtn.addEventListener("click", hit);
        doubleBtn.addEventListener("click", double);
        stayBtn.addEventListener("click", stay);
        splitBtn.addEventListener("click", split);

        stayBtn.disabled = false;
        hitBtn.disabled = false;
        doubleBtn.disabled = false;
    }, 2600);

    setTimeout(() => {
        checkForBlackjack();
    }, 3400);
}

window.addEventListener("DOMContentLoaded", () => {
    playBtn.addEventListener("click", game);
});
