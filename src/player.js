import PlayerArea from "./components/table/playerarea-component/playerArea";
import Hand from "./components/table/hand-component/hand";

let playerId = 1;

export default class Player {
    constructor(game, name) {
        this.id = playerId++;
        this.game = game;
        this.name = name;
        this.gameObjects = null;

        this.area = null;
        this.hand = null;
        this.dices = [];
    }

    init() {
        this.area.init();
        this.hand.init();

        this.hand.event.on("diceroled").do(this.diceRolled);
    }

    addHand(hand) { this.hand = hand; return this; }

    addArea(area) { this.area = area; return this; }

    diceRolled(e) {
        //todo: handle taking cards
        // console.log("Player - received rolled dice");
        // console.log(e.details);
    }

    addDices(dices) {
        this.dices = dices;
    }

    takeDices() {
        let dices = this.dices;
        this.dices = null;
        return dices;
    }

    giveDice(dice) {
        let playerDice = this.dices.find((d) => { return d.id == dice.id });
        if (!playerDice) this.dices.push(dice);
        else console.log("Player already has dice: " + dice.id)
    }

    giveDices(player) {
        this.dices.forEach((d) => player.giveDice(d));
        this.dices = null;
    }

    setInactive() {
        this.hand.addClass("inactive");
        this.area.addClass("inactive");
    }

    setActive() {
        this.hand.removeClass("inactive");
        this.area.removeClass("inactive");
    }
}