import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";

let idCounter = 0;

export default class Resource extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: details.type.name + "" + id,
            className: "resource " + details.type.name,
            div: document.createElement("img")
        })
        
        this.draggingObject = null;

        this.idCounter = id;
        this.game = game;
        this.type = details.type;

        this.isDraggable = true;
        this.imgSrc = details.imgSource;
    }

    init() {
        this.draggingObject = new DraggingObject(this).init();
        this.parent.add(this);
    }

    add(child) {
        super.add(child, () => child.setPlayed());
    }

    isPlayed() {
        return !this.isDraggable;
    }

    setPlayed() {
        this.isDraggable = false;
        this.style.margin = null;
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