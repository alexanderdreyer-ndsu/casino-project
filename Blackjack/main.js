const playBtn = document.getElementById("play-btn");
const hitBtn = document.getElementById("hit-btn");
const stayBtn = document.getElementById("stay-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");

let playerCardDisplay = document.getElementById("display-player-cards");
let dealerCardDisplay = document.getElementById("display-dealer-cards");
let playerSplitCardDisplay = document.getElementById("display-player-split-cards");
let displayGameInfo = document.getElementById("game-output-display");
let balanceOutput = document.getElementById("balance-output");

let faceDownCardImage = document.createElement('img');

let dealerHand = new Hand();
let playerHand1 = new Hand();
let playerHand2 = new Hand();
let shoe = new Shoe(6);
let balance = 100;
let originalBet;
let totalBet;
let faceDownCard;

dealerHand.cardDisplay = dealerCardDisplay;
playerHand1.cardDisplay = playerCardDisplay;
playerHand2.cardDisplay = playerSplitCardDisplay;

balanceOutput.innerText = balance.toFixed(2);

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

    balanceOutput.innerText = balance.toFixed(2);

    setTimeout(() => {
        playBtn.disabled = false;
    }, 1000);
}

function endGameFromCheckForBlackjack() {
    faceDownCardImage.src = faceDownCard.imagePath;

    disableButtons();

    balanceOutput.innerText = balance.toFixed(2);

    setTimeout(() => {
        playBtn.disabled = false;
    }, 1000);
}

function checkForBlackjack() {
    const isDealerBlackjack = dealerHand.count === 21;
    const isPlayerBlackjack = playerHand1.count === 21;
    const checkDidPlayerSplit = playerHand1.selected && playerHand2.count !== 0;

    if (!checkDidPlayerSplit) {
        if (isDealerBlackjack) {
            isPlayerBlackjack ? balance += playerHand1.betOnThisHand : balance = balance;

            displayGameInfo.innerText = `${isPlayerBlackjack ? "Push" : "Dealer Blackjack"}`;

            return endGameFromCheckForBlackjack();
        }

        if (isPlayerBlackjack) {
            balance += playerHand1.betOnThisHand * 2.5;

            displayGameInfo.innerText = "Player Blackjack";

            return endGameFromCheckForBlackjack();
        }
    }
    
    const isPlayer2Blackjack = playerHand2.count === 21;

    if (isPlayerBlackjack && isPlayer2Blackjack) {
        balance += totalBet * 2.5;

        displayGameInfo.innerText = "Player Hand 1 Blackjack, Player Hand 2 Blackjack";

        return endGameFromCheckForBlackjack();
    } 
    
    if (isPlayerBlackjack) {
        balance += playerHand1.betOnThisHand * 2.5;

        displayGameInfo.innerText = "Player Hand 1 Blackjack";

        return stay();
    }
    
    if (isPlayer2Blackjack) {
        balance += playerHand2.betOnThisHand * 2.5;

        playerHand1.selected = true;
        playerHand2.selected = false;

        displayGameInfo.innerText = "Player Hand 2 Blackjack";
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

function calculateWinner() {
    const dealerScore = dealerHand.count <= 21 ? dealerHand.count : 0;
    const playerScore = playerHand1.count <= 21 ? playerHand1.count : -1;
    const checkDidPlayerSplit = playerHand2.count !== 0;
    const dealerWon = dealerScore > playerScore;

    console.log(`Dealer score = ${dealerScore}`);
    console.log(`Player score = ${playerScore}`);

    if (!checkDidPlayerSplit) {
        if (dealerScore !== playerScore) {
            dealerWon ? balance = balance : balance += playerHand1.betOnThisHand * 2;

            return displayGameInfo.innerText = `${dealerWon ? "Dealer Win" : "Player Win"}`;
        }

        balance += totalBet;
        return displayGameInfo.innerText = "Push";
    }

    const player2Score = playerHand2.count <= 21 ? playerHand2.count : -1;
    const dealerWonHand2 = dealerScore > player2Score;
    let dealerVsPlayer1Message;
    let dealerVsPlayer2Message;
    console.log(`Player 2 score = ${player2Score}`);

    if (dealerScore !== playerScore) {
        dealerWon ? balance = balance : balance += playerHand1.betOnThisHand * 2;

        dealerVsPlayer1Message = dealerWon ? "Dealer Win Hand 1" : "Player Win Hand 1";
    } else {
        balance += totalBet;

        dealerVsPlayer1Message = "Push";
    }

    if (dealerScore !== player2Score) {
        dealerWonHand2 ? balance = balance : balance += playerHand2.betOnThisHand * 2;

        dealerVsPlayer2Message = dealerWonHand2 ? "Dealer Win Hand 2" : "Player Win Hand 2";
    } else {
        balance += totalBet;

        dealerVsPlayer2Message = "Push";
    }

    displayGameInfo.innerText = `${dealerVsPlayer1Message}, ${dealerVsPlayer2Message}`;
}

function disableButtons() {
    stayBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    splitBtn.disabled = true;
}

function reduceHandAces(hand) {
    if (hand.count <= 21) {
        return;
    }

    for (const card of hand.cards) {
        if (card.numValue === 'Ace') hand.count -= 10;
    }
}

function runDealerTurn() {
    if (dealerHand.count === 22) {
        reduceHandAces(dealerHand);
    }

    while (dealerHand.count < 17) {
        drawCard(dealerHand);
        reduceHandAces(dealerHand);
    }

    if (dealerHand.count - 10 === 7 && dealerHand.cards.some(card => card.numValue === 'Ace')) {
        drawCard(dealerHand);
    }

    endGame();
}

function hit() {
    if (playerHand1.selected && playerHand1.count < 21) drawCard(playerHand1);

    if (playerHand2.selected && playerHand2.count < 21) drawCard(playerHand2);

    reduceHandAces(playerHand1);
    reduceHandAces(playerHand2);

    const checkDidPlayerSplit = playerHand2.count !== 0;

    if (playerHand1.count < 21) {
        doubleBtn.disabled = true;
        splitBtn.disabled = true;

        return;
    }

    if (playerHand1.count === 21 && !checkDidPlayerSplit) return runDealerTurn();

    if (!checkDidPlayerSplit || playerHand2.count >= 21) return endGame();

    playerHand1.selected = false;
    playerHand2.selected = true;

    doubleBtn.disabled = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = 'limegreen';
}

function double() {
    balance -= originalBet;
    balanceOutput.innerText = balance.toFixed(2);

    if (playerHand1.selected) {
        playerHand1.betOnThisHand += originalBet;

        drawCard(playerHand1);
        reduceHandAces(playerHand1);
    }

    if (playerHand2.selected) {
        playerHand2.betOnThisHand += originalBet;

        drawCard(playerHand2);
        reduceHandAces(playerHand2)
        runDealerTurn();
    }

    const checkDidPlayerSplit = playerHand2.count !== 0;

    if (!checkDidPlayerSplit) {
        return playerHand1.count >= 21 ? endGame() : runDealerTurn();
    }

    playerHand1.selected = false;
    playerHand2.selected = true;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = 'limegreen';
}

function stay() {
    const checkDidPlayerSplit = playerHand1.selected && playerHand2.count !== 0;

    if (!checkDidPlayerSplit) {
        return runDealerTurn();
    } 

    playerHand1.selected = false;
    playerHand2.selected = true;

    doubleBtn.disabled = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = 'limegreen';
}

function split() {
    balance -= originalBet;
    playerHand2.betOnThisHand = playerHand1.betOnThisHand;
    balanceOutput.innerText = balance.toFixed(2);

    splitBtn.disabled = true;

    playerCardDisplay.style.backgroundColor = 'limegreen';

    const splitCard = playerHand1.cards[1];
    playerHand2.addToHand(splitCard);

    const img = document.createElement('img');
    img.src = splitCard.imagePath;
    img.className = "game-cards";

    playerSplitCardDisplay.appendChild(img);

    playerHand1.popFromHand();

    drawCard(playerHand1);
    drawCard(playerHand2);
    checkForBlackjack();
}

function game() {
    let userBetInput = document.getElementById("user-input-bet").value;

    displayGameInfo.innerText = "";

    originalBet = Number(userBetInput) >= 0.01 && Number(userBetInput) <= balance ? Number(userBetInput) : 0;

    if (originalBet === 0) return window.alert("Invalid Bet");

    playerHand1.betOnThisHand = originalBet;
    totalBet = originalBet;
    balance -= totalBet;
    balanceOutput.innerText = balance.toFixed(2);

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
        if (balance - originalBet >= 0) doubleBtn.addEventListener("click", double);
        stayBtn.addEventListener("click", stay);
        if (balance - originalBet >= 0) splitBtn.addEventListener("click", split);

        stayBtn.disabled = false;
        hitBtn.disabled = false;
        doubleBtn.disabled = false;
    }, 2300);

    setTimeout(() => {
        checkForBlackjack();
    }, 3400);
}

window.addEventListener("DOMContentLoaded", () => {
    playBtn.addEventListener("click", game);
});
