class Hand {
    constructor() {
        this.cards = [];
        this.count = 0;
        this.selected = false;
    }

    calculateHandCount() {
        this.count = 0;

        for (let card of this.cards) {
            console.log(card);
            console.log("length: " + this.cards.length);

            const value = card.numValue;
            
            const faceCards = ["Jack", "Queen", "King"];

            if (faceCards.includes(value)) {
                this.count += 10;
            } else if (value === "Ace") {
                this.count += 11;
            } else {
                this.count += parseInt(value);
            }
        }

        return this.count;
    }

    addToHand(card) {
        this.cards.push(card);
        this.calculateHandCount();
    }

    popFromHand() {
        let images = document.getElementsByTagName('img');

        let card = this.cards[1];
        this.cards.splice(1, 1);
        this.calculateHandCount();

        for (let image of images) {
            if (image.src.includes(card.imagePath)) {
                playerCardDisplay.removeChild(image);
                break;
            }
        }
    }

    clearHand() {
        let images = document.getElementsByTagName('img');

        this.cards = [];
        this.count = 0;

        while (images.length !== 0) {
            for (const image of images) {
                image.parentNode.removeChild(image);
            }
        }
    }
}
