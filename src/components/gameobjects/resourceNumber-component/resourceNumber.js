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
        this.type = details.type || null;
        this.position = null;
    }

    static get orderedResNums() { return [...RES_NUMS] }
    
    init() {
        this.draggingObject = new DraggingObject(this).init();
        this.showValue();
    }
    setBoardPosition(pos) {
        this.position = pos;
    }
    setPlayed() {
        this.addClass("played");
        this.isDraggable = false;
        this.showValue();
        return this;
    }

    showValue() {
        this.inspect.innerText = this.value;
        return this;
    }

    showChar() {
        this.inspect.innerText = this.char;
        return this;
    }

    turnAround() {
        if(this.inspect.innerText == this.value)
            this.showChar();
        else 
            this.showValue();
        return this;
    }
    
    onDragStart() {
        this.draggingObject.startDragging();
        this.className += " hold";
        setTimeout(() => (this.hide()), 0)
    }

    onDragEnd() {
        this.draggingObject.endDragging();
        this.changeClass(this.classNameDefault);
    }
}