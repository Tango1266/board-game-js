import MyHtmlElement from "../../htmlElement";


export default class Board extends MyHtmlElement {

    constructor({buildingSlots = [], resourceSlots = []} = {}) {
        super({
            div: document.getElementById("board")
        })
        this.buildingSlots = buildingSlots;
        this.resourceSlots = resourceSlots;
    }

    init() {
        this.resourceSlots.forEach((res) => res.init());
        this.buildingSlots.forEach((bs) => bs.init());
    }
}