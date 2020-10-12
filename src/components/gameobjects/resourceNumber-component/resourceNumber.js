import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";

let idCounter = 0;

const RES_NUMS = [
    5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11
]

export default class ResourceNumber extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: "resource-number-" + id,
            className: "resource-number",
            div: document.createElement("div")
        })

        this.draggingObject = null;
        this.game = game;

        this.isDraggable = true;
        this.value = details.value || -1;
        this.char = details.char || [];
    }

    static get orderedResNums() { return [...RES_NUMS] }
    
    init() {
        // this.draggingObject = new DraggingObject(this).init();
        this.addNum(this.value);
    }

    setPlayed() {
        console.log("played", this)
    }

    addNum(num) {
        this.div.innerText = num;
    }
}