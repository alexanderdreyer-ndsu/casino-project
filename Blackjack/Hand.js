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
            if(image.id == "faceDownCardImage"){
                dealerCardDisplay.removeChild(image);
            }
            else{
                image.parentElement == "display-player-cards" ? playerCardDisplay.removeChild(image) : dealerCardDisplay.removeChild(image);
            }
        }
    }
}
