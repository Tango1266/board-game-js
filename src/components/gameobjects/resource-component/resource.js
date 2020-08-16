import MyHtmlElement from "../../htmlElement";

let idCounter = 0;

export let draggingResource;

export default class Resource extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: details.type.name + "" + id,
            className: "resource " + details.type.name,
            div: document.createElement("img")
        })
        this.idCounter = id;
        this.game = game;
        this.type = details.type;

        this.isDraggable = true;
        this.imgSrc = details.imgSource;
    }

    init() {
        this.parent.add(this);
        this.initEventListener();
    }

    add(child) {
        super.add(child, () => child.setPlayed());
    }

    initEventListener() {
        this.event.ondragstart.do(this.dragStart);
        this.event.ondragend.do(this.dragEnd);
    }

    isPlayed() {
        return !this.isDraggable;
    }

    setPlayed() {
        this.isDraggable = false;
        this.style.margin = null;
        setTimeout(() => this.addClass("played-" + this.type.slotType.name), 50)
    }

    dragStart() {
        this.className += " hold";
        draggingResource = this;
        this.game.event.emit("dragging");
        setTimeout(() => (this.hide()), 0)
    }


    dragEnd() {
        this.game.event.emit("draggingend");
        draggingResource = null;
        this.changeClass(this.classNameDefault);
    }
}