class Deck {
    constructor() {
        this.history = []
        const cards = [];
        const mas = ['♦', '♥', '♣', '♠'];
        const num = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        for (let i = 0; i < mas.length; i++) {
            for (let y = 0; y < num.length; y++) {
                let sum = 0;
                if (num[y] == 'J') {
                    sum = 2
                } else if (num[y] == 'Q') {
                    sum = 3
                } else if (num[y] == 'K') {
                    sum = 4
                } else if (num[y] == 'A') {
                    sum = 11
                } else {
                    sum = +num[y]
                }
                let obj = { title: `${num[y]} ${mas[i]}`, score: sum }
                cards.push(obj)
            }
        }
        this.cards = cards
    }
    random(min, max) {
        return Math.floor(Math.random() * (max - min))
    }
    getRandomCard() {
        let r = this.random(0, this.cards.length - 1);
        let cardr = this.cards[r];
        this.cards.splice(r, 1);
        this.history.push(cardr)
        return cardr;
    }

    result() {
        let result = this.history.reduce((acc, b) => { return acc + b.score }, 0)
        let str = ''
        let isWin = false
        if (result > 21) {
            str = `Lose: ${result}`
        } else if (result == 21) {
            str = `Win: ${result}`
            isWin = true
        } else {
            str = `UnderCount: ${result}`
        }
        let obj = { str: str , isWin: isWin }
        return obj
    }
}

module.exports = { Deck }
