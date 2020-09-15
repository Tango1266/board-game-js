import MyHtmlElement from "../../htmlElement";

let diceId = 0;

export class Dice extends MyHtmlElement {
    constructor({ game = null, div = null, diceControl = null } = {}) {
        super({
            div: div,
            draggable: true,
        })

        this.id = "dice-" + diceId++;
        this.currentResult = null;
        this.owner = game;
    }

    init() {
        // todo
    }

    roll() {
        const min = 1;
        const max = 6;
        this.currentResult = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.currentResult;
    }

    readResult() {
        return this.currentResult;
    }

    showResult() {
        return Array.from(this.div.children).find((child) => child.id == "dice-side-" + this.currentResult);
    }

    setOwner(player) {
        this.owner = player;
        this.owner.giveDice(this);
    }
}