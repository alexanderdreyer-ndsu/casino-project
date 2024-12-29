class Deck{
    constructor(){
        this.deck = [];

        const suites = ["Spades", "Hearts", "Clubs", "Diamonds"];
        const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

        for(let suite of suites){
            for(let numValue of values){
                let card = new Card(numValue, suite, `Images/${numValue}Of${suite}.png`);
                this.deck.push(card);
            }
        }
    }

    drawCard(){
        const drawIndex = Math.floor(Math.random() * 52);
        const card = this.deck[drawIndex];
    
        return card;
    }
}

class Card{
    constructor(numValue, suite, imagePath){
        this.numValue = numValue;
        this.suite = suite;
        this.imagePath = imagePath;
    }
}

class Hand{
    constructor(){
        this.cards = [];
        this.count = 0;
    }

    calculateHandCount(){
        this.count = 0;
        for(let card of this.cards){
            const value = card.numValue;
            const faceCards = ["Jack", "Queen", "King"];

            if(faceCards.includes(value)){
                this.count += 10;
            }
            else if(value == "Ace"){
                this.count += 11;
            }
            else{
                this.count += parseInt(value);
            }
        }

        return this.count;
    }

    addToHand(card){
        this.cards.push(card);
        this.calculateHandCount();
    }

    clearHand(){
        let images = document.getElementsByTagName('img');

        this.cards = [];
        this.count = 0;

        for(let image of images){
            image.parentElement == "display-player-cards" ? playerCardDisplay.removeChild(image) : dealerCardDisplay.removeChild(image);
        }
    }
}

function addImageToPlayerCards(card){
    let playerCardDisplay = document.getElementById("display-player-cards");
    const img = document.createElement('img');
    img.src = card.imagePath;
    img.style.height = '140px';
    img.style.width = '100px';
    playerCardDisplay.appendChild(img);
}

function addImageToDealerCards(card){
    let dealerCardDisplay = document.getElementById("display-dealer-cards");
    const img = document.createElement('img');
    img.src = card.imagePath;
    img.style.height = '140px';
    img.style.width = '100px';
    dealerCardDisplay.appendChild(img);
}

function game(){
    const hitBtn = document.getElementById("hit-btn");
    const stayBtn = document.getElementById("stay-btn");
    const splitBtn = document.getElementById("split-btn");
    const doubleBtn = document.getElementById("double-btn");
    let dealerCardDisplay = document.getElementById("display-dealer-cards");
    let playerCardDisplay = document.getElementById("player-card-display");
    const deck = new Deck();
    console.log(deck);
    let dealerHand = new Hand();
    let playerHand = new Hand();
    let faceDown;

    setTimeout(() => {
        faceDown = deck.drawCard();
        dealerHand.addToHand(faceDown);
        const img = document.createElement('img');
        img.src = "Images/backOfCard.jpeg";
        img.style.height = '140px';
        img.style.width = '100px';
        dealerCardDisplay.appendChild(img);
    }, 500);

    setTimeout(() => {
        const card = deck.drawCard();
        playerHand.addToHand(card);
        addImageToPlayerCards(card);
    }, 500);

    setTimeout(() => {
        const card = deck.drawCard();
        dealerHand.addToHand(card);
        addImageToDealerCards(card);
    }, 500);

    setTimeout(() => {
        const card = deck.drawCard();
        playerHand.addToHand(card);
        addImageToPlayerCards(card);
    }, 500);

    console.log(dealerHand);
    console.log(playerHand);

    hitBtn.addEventListener("click", () => {
        setTimeout(() => {
            const card = deck.drawCard();
            playerHand.addToHand(card);
            addImageToPlayerCards(card);
        }, 500);
    });

    doubleBtn.addEventListener("click", () => {
        setTimeout(() => {
            const card = deck.drawCard();
            playerHand.addToHand(card);
            addImageToPlayerCards(card);
        }, 500);

    });

    stayBtn.addEventListener("click", () => {

    });

    //setTimeout(() => {
    //    const card = deck.drawCard();
    //    dealerHand.addToHand(card);
    //    dealerHand.calculateHandCount();
    //    const img = document.createElement('img');
    //    img.src = card.imagePath;
    //    dealerCardDisplay.appendChild(img);
    //}, 500);
}

window.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play-btn");
    playBtn.addEventListener("click", () => {
        game();
    });
});