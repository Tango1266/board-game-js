import MyHtmlElement from "../../htmlElement";

let idCounter = 1;

export default class CardArea extends MyHtmlElement {
    constructor() {
        let id = "card-area-" + idCounter++;
        super({
            id: id,
            className: "card-area",
            parent: new MyHtmlElement({ div: document.getElementById("card-area-container") })
        })
        this.cards = [];
        this.parent.style.gridArea = "cardArea"
    }

    init() {
        this.parent.add(this);
    }

}