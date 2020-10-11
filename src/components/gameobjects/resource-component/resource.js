import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";
import ResourceNumber from "../resourceNumber-component/resourceNumber";

let idCounter = 0;

export default class Resource extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: details.type.name + "" + id,
            className: "resource " + details.type.name,
            div: document.createElement("div")
        })
       
        this.image = new MyHtmlElement({div: document.createElement("img"), id: "img-" + details.type.name + "" + id, src: details.imgSource, className: "img-resource", draggable: true});
        this.draggingObject = null;

        this.idCounter = id;
        this.game = game;
        this.type = details.type;

        this.isDraggable = true;
        this.diceNum = 0;

        this.lastPlayed = null;
    }

    init() {
        this.draggingObject = new DraggingObject(this).init();
        this.add(this.image);
        this.parent.add(this);
    }

    isPlayed() {
        return !this.isDraggable;
    }

    setPlayed() {
        this.isDraggable = false;
        this.image.isDraggable = false;
        this.style.margin = null;
        this.lastPlayed = this;
        setTimeout(() => this.addClass("played-" + this.type.slotType.name), 50)
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