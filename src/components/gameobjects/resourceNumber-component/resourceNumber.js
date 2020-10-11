import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";

let idCounter = 0;

export default class ResourceNumber extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: "resource-number-" +  id,
            className: "resource-number",
            div: document.createElement("div")
        })
        
        this.draggingObject = null;
        this.game = game;

        this.isDraggable = true;
    }

    init() {
        this.draggingObject = new DraggingObject(this).init();
    }

    setPlayed(){
        console.log("played", this)
    }

    addNum(num) {
        this.div.innerText = num;
    }
}