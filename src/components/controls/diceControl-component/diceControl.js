import MyHtmlElement from "../../htmlElement";


export class DiceControl extends MyHtmlElement {
    constructor({} = {}) {
        super({
            id: "dice-control",
            className: "dice-control",
        })

        this.owner = null;
        this.dices = [];
    }

    init() {
        // todo
        return this;
    }

    addDice(dice) {
        let playerDice = this.dices.find((d) => { return d.id == dice.id });
        if (playerDice) {
            console.log("Already controlling dice: " + dice.id);
            return;
        }
        this.dices.push(dice);
        this.add(dice);
        return this;
    }

    setDices(dices) {
        this.dices = dices;
        for (var dice of this.dices) {
            this.addDice(dice);
        }
        return this;
    }

    giveControl(player) {
        this.owner = player;
        return this;
    }

    removeControl() {
        this.owner = game;
        return this;
    }

    showControl() {
        // hand is rotated for each player, so we need to adjust controls
        let transform = "";
        switch (this.owner.id) {
            case 1:
                break;
            case 2:
                transform = "rotateX(180deg)";
                break;
            case 3:
                transform = "rotateX(180deg) rotateY(180deg)";
                break;
            case 4:
                transform = "rotateY(180deg)";
                break;
        }
        this.style.transform = transform;

        // add controls and dices to dom
        this.owner.hand.add(this);

        return this;
    }

    hideControl() {
        this.owner.hand.remove(this);
        return this;
    }

    rollDices() {
        for (let shuffle = 0; shuffle < Math.ceil(Math.random() * 10); shuffle++) {
            this.dices.forEach((d) => d.roll())
        }

        let payload = {
            playerId: this.owner.id,
            playerName: this.owner.name,
            diceId: [],
            result: []
        }
        this.dices.forEach((d) => {
            payload.diceId.push(d.id);
            payload.result.push(d.readResult());
        })
        this.owner.hand.event.emit("diceroled", null, payload, true)
    }
}