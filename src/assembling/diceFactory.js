import { Dice } from "../components/table/dice-component/dice";
import createButton from "../components/controls/controls";

export default class DiceFactory {
    constructor() {}

    makeDices(numberOfDices) {
        let dices = [];
        for (var i = 0; i < numberOfDices; i++) {
            dices.push(this.makeDice());
        }
        return dices;
    }

    makeDice() {
        let dice = document.createElement("div");
        dice.className = "dice";

        let side1 = this.makeDiceSide("bottom-side", ["center"]);
        let side2 = this.makeDiceSide("left-side", ["top left", "bottom right"]);
        let side3 = this.makeDiceSide("back-side", ["top left", "center", "bottom right"]);
        let side4 = this.makeDiceSide("front-side", [
            "top left",
            "top right",
            "bottom left",
            "bottom right"
        ]);
        let side5 = this.makeDiceSide("right-side", [
            "top left",
            "top right",
            "center",
            "bottom left",
            "bottom right"
        ]);
        let side6 = this.makeDiceSide("top-side", [
            "top left",
            "mid left",
            "bottom left",
            "top right",
            "mid right",
            "bottom right"
        ]);

        this.appendAll(dice, [side1, side2, side3, side4, side5, side6]);

        return new Dice({ game: this.game, div: dice });
    }

    appendAll(htmlElement, arr) {
        arr.forEach((e) => {
            htmlElement.append(e);
        })
    }

    makeDiceSide(side, dotPositions) {
        let diceSide = document.createElement("div");
        diceSide.className = "dice-side " + side;
        diceSide.id = "dice-side-" + (dotPositions.length)
        dotPositions.forEach((el) => {
            let dot = document.createElement("div");
            dot.className = "dot " + el;
            diceSide.append(dot);
        });

        return diceSide;
    }
}