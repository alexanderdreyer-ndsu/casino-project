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

let shoe = new Shoe(6);

let faceDownCard;

dealerHand.cardDisplay = dealerCardDisplay;
playerHand1.cardDisplay = playerCardDisplay;
playerHand2.cardDisplay = playerSplitCardDisplay;

function drawFaceDownCard() {
    faceDownCard = shoe.drawCard();
    dealerHand.addToHand(faceDownCard);

    faceDownCardImage.src = "Images/backOfCard.jpeg";
    faceDownCardImage.style.height = '70px';
    faceDownCardImage.style.width = '50px';

    dealerCardDisplay.appendChild(faceDownCardImage);
    
    reduceHandAces(dealerHand);
}

function drawCard(hand) {
    const card = shoe.drawCard();
    hand.addToHand(card);

    const img = document.createElement('img');
    img.src = card.imagePath;
    img.style.height = '70px';
    img.style.width = '50px';
    img.style.marginLeft = '5px';
    img.style.marginBottom = '5px';

    hand.cardDisplay.appendChild(img);
}

function endGame() {
    faceDownCardImage.src = faceDownCard.imagePath;
    faceDownCardImage.style.marginLeft = '5px';

    playBtn.disabled = false;

    disableButtons();
}

function checkForBlackjack() {
    const gameIsSplit = playerHand1.selected || playerHand2.selected;
    const isDealerBlackjack = dealerHand.count === 21;
    const isPlayerBlackjack = playerHand1.count === 21;

    if (gameIsSplit) {
        const isPlayer2Blackjack = playerHand2.count === 21;
        
        if (isPlayerBlackjack && isPlayer2Blackjack) {
            endGame();
            window.alert("Player Hand 1 Blackjack, Player Hand 2 Blackjack");
        } else if (isPlayerBlackjack) {
            window.alert("Player Hand 1 Blackjack");
            stay();
        } else if (isPlayer2Blackjack) {
            window.alert("Player Hand 2 Blackjack");
        }
    } else {
        if (isDealerBlackjack) {
            endGame();
            isPlayerBlackjack ? window.alert("Push") : window.alert("Dealer Blackjack");
        } else if (isPlayerBlackjack) {
            endGame();
            window.alert("Player Blackjack");
        }
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
    img.style.marginBottom = '5px';

    playerSplitCardDisplay.appendChild(img);

    playerHand1.popFromHand();

    drawCard(playerHand2);
    drawCard(playerHand1);
}

function calculateWinner() {
    const gameIsSplit = playerHand1.selected || playerHand2.selected;
    const dealerScore = dealerHand.count <= 21 ? dealerHand.count : 0;
    const playerScore = playerHand1.count <= 21 ? playerHand1.count : 0;
    
    if (gameIsSplit) {
        const player2Score = playerHand2.count <= 21 ? playerHand2.count : 0;
        let outputString;

        //fix this so it builds a string not hardcode
        //this is just counting how far away the score is from 21
        //0 > -2 this means busting by 2 is better than 21
        if (dealerScore > playerScore && dealerScore > player2Score) {
            endGame();
            window.alert("Dealer Wins Both");
        } else if (dealerScore > playerScore && dealerScore < player2Score) {
            endGame();
            window.alert("Player Hand 1 Lose, Player Hand 2 Win");
        } else if (dealerScore < playerScore && dealerScore > player2Score) {
            endGame();
            window.alert("Player Hand 1 Win, Player Hand 2 Lose");
        } else if (dealerScore < playerScore && dealerScore < player2Score) {
            endGame();
            window.alert("Player Wins Both");
        } else if (dealerScore === playerScore && dealerScore < player2Score) {
            endGame();
            window.alert("Player Hand 1 Push, Player Hand 2 Win");
        } else if (dealerScore === playerScore && dealerScore > player2Score) {
            endGame();
            window.alert("Player Hand 1 Push, Player Hand 2 Lose");
        } else if (dealerScore < playerScore && dealerScore === player2Score) {
            endGame();
            window.alert("Player Hand 1 Win, Player Hand 2 Push");
        } else if (dealerScore > playerScore && dealerScore === player2Score) {
            endGame();
            window.alert("Player Hand 1 lose, Player Hand 2 Push");
        } else if (dealerScore === playerScore && dealerScore === player2Score) {
            endGame();
            window.alert("Push");
        }
    } else {
        if (playerHand1.count > 21) {
            endGame();
            window.alert("Player Bust, Dealer Win");
        } else if (playerScore !== 0 && dealerScore === 0) {
            endGame();
            window.alert("Dealer Bust, Player Win");
        } else if (dealerScore > playerScore) {
            endGame();
            window.alert("Dealer Win");
        } else if (dealerScore < playerScore) {
            endGame();
            window.alert("Player Win");
        } else {
            endGame();
            window.alert("Push");
        }
    }
}

function disableButtons() {
    stayBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    splitBtn.disabled = true;
}

function reduceHandAces(hand) {
    if (hand.count > 21 && hand.cards.some(card => card.numValue === 'Ace')) {
        for (const card of hand.cards) {
            if (card.numValue === 'Ace') hand.count -= 10;
        }
    }
}

function runDealerTurn() {
    disableButtons();

    while (dealerHand.count < 17) {
        drawCard(dealerHand);
        reduceHandAces(dealerHand);
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

    reduceHandAces(playerHand1);
    reduceHandAces(playerHand2);

    if (playerHand1.count < 21) {
        doubleBtn.disabled = true;
        splitBtn.disabled = true;
    } else {
        if (isGameSplit) {
            playerHand1.selected = false;
            playerHand2.selected = true;
            doubleBtn.disabled = false;

            playerCardDisplay.style.backgroundColor = null;
            playerSplitCardDisplay.style.backgroundColor = 'limegreen';
        } else {
            runDealerTurn();
        }
    }

    if (playerHand2.count >= 21) {
        playerSplitCardDisplay.style.backgroundColor = null;
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

        playerCardDisplay.style.backgroundColor = null;
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
        playerCardDisplay.style.backgroundColor = null;
        playerSplitCardDisplay.style.backgroundColor = 'limegreen';
    } else {
        runDealerTurn();
    }
}

function split(){
    splitBtn.disabled = true;
    splitHand();
    checkForBlackjack();
}

function game() {
    playerHand1.clearHand();
    playerHand2.clearHand();
    dealerHand.clearHand();

    playBtn.disabled = true;
    stayBtn.disabled = false;
    hitBtn.disabled = false;
    doubleBtn.disabled = false;
    playerHand1.selected = false;
    playerHand2.selected = false;

    playerCardDisplay.style.backgroundColor = null;
    playerSplitCardDisplay.style.backgroundColor = null;

    drawFaceDownCard();
    drawCard(playerHand1);
    drawCard(dealerHand);
    drawCard(playerHand1);

    checkForSplitAllowed() ? splitBtn.disabled = false : splitBtn.disabled = true;

    checkForBlackjack();

    hitBtn.addEventListener("click", hit);
    doubleBtn.addEventListener("click", double);
    stayBtn.addEventListener("click", stay);
    splitBtn.addEventListener("click", split);
}

window.addEventListener("DOMContentLoaded", () => {
    playBtn.addEventListener("click", game);
});