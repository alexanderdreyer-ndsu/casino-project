const playBtn = document.getElementById("play-btn");
let playerCardDisplay = document.getElementById("display-player-cards");
let dealerCardDisplay = document.getElementById("display-dealer-cards");
let faceDownCardImage = document.createElement('img');
const hitBtn = document.getElementById("hit-btn");
const stayBtn = document.getElementById("stay-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");
let gameFinished = false;
let dealerHand = new Hand();
let playerHand = new Hand();
const deck = new Deck();
let faceDownCard;

function drawFaceDownCard(){
    faceDownCard = deck.drawCard();
    dealerHand.addToHand(faceDownCard);
    faceDownCardImage.src = "Images/backOfCard.jpeg";
    faceDownCardImage.style.height = '70px';
    faceDownCardImage.style.width = '50px';
    faceDownCardImage.marginLeft = '5px';
    dealerCardDisplay.appendChild(faceDownCardImage);
}

function drawPlayerCard(){
    const card = deck.drawCard();
    playerHand.addToHand(card);
    const img = document.createElement('img');
    img.src = card.imagePath;
    img.style.height = '70px';
    img.style.width = '50px';
    img.style.marginLeft = '5px';
    playerCardDisplay.appendChild(img);
}

function drawDealerCard(){
    const card = deck.drawCard();
    dealerHand.addToHand(card);
    const img = document.createElement('img');
    img.src = card.imagePath;
    img.style.height = '70px';
    img.style.width = '50px';
    img.style.marginLeft = '5px';
    dealerCardDisplay.appendChild(img);
}

function revealFaceDownCard(){
    faceDownCardImage.src = faceDownCard.imagePath;
    faceDownCardImage.style.marginLeft = '5px';
}

function checkForBlackjack(){
    if(dealerHand.count == 21 & playerHand.count != 21){
        window.alert("Dealer Blackjack");
        revealFaceDownCard();
    }

    if(playerHand.count == 21 & dealerHand.count != 21){
        window.alert("Player Blackjack");
        revealFaceDownCard();
    }

    if(dealerHand.count == 21 & playerHand.count == 21){
        window.alert("Tie");
        revealFaceDownCard();
    }
}

function checkForWinner(){
    if(playerHand.count > 21){
        revealFaceDownCard();
        setTimeout(window.alert("Player Bust, Dealer Win"), 1000);
    }
    else if(21 - dealerHand.count < 21 - playerHand.count){
        revealFaceDownCard();
        setTimeout(window.alert("Dealer Wins"), 1000);
    }
    else{
        revealFaceDownCard();
        setTimeout(window.alert("Player Wins"), 1000);
    }
}

function disableButtons(){
    stayBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    splitBtn.disabled = true;
}

function dealersTurn(){
    disableButtons();
    revealFaceDownCard();
    while(dealerHand.count < 17){
        drawDealerCard();
    }

    checkForWinner();
}

function game(){
    playBtn.disabled = true;
    playerHand.clearHand();
    dealerHand.clearHand();
    stayBtn.disabled = false;
    hitBtn.disabled = false;
    doubleBtn.disabled = false;
    splitBtn.disabled = false;

    drawFaceDownCard();
    console.log(faceDownCard);
    drawPlayerCard();
    drawDealerCard();
    drawPlayerCard();

    checkForBlackjack();

    hitBtn.addEventListener("click", () => {
        drawPlayerCard();
        if (playerHand.count < 21) {
            doubleBtn.disabled = true;
            splitBtn.disabled = true;
        }
        else{
            dealersTurn();
        }
    });

    doubleBtn.addEventListener("click", () => {
        if(playerHand.count < 21){
            drawPlayerCard();
            dealersTurn();
        }
    });

    stayBtn.addEventListener("click", () => {
        dealersTurn();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    playBtn.addEventListener("click", () => {
        game();
    });
});
