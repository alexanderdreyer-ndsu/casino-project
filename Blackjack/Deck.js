class Deck {
    constructor() {
        this.deck = [];

        const suites = ["Spades", "Hearts", "Clubs", "Diamonds"];
        const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

        for (let suite of suites) {
            for (let numValue of values) {
                let card = new Card(numValue, suite, `Images/${numValue}Of${suite}.png`);
                this.deck.push(card);
            }
        }
    }

    drawCard() {
        const drawIndex = Math.floor(Math.random() * 52);
        const card = this.deck[drawIndex];

        return card;
    }
}
