import MyHtmlElement from "./htmlElement";

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

        this.div.draggable = true;
        this.div.src = details.imgSource;
    }

    add(child) {
        super.add(child, () => child.setPlayed());
    }

    initEventListener() {
        this.div.ondragstart = this.dragStart.bind(this);
        this.div.ondragend = this.dragEnd.bind(this);
    }

    isPlayed() {
        return !this.div.draggable;
    }

    setPlayed() {
        this.div.draggable = false;
        this.div.style.margin = null;
        setTimeout(() => this.addClass("played-" + this.type.slotType.name), 50)
    }


    draw() {
        this.parent.add(this);
        this.initEventListener();
    }


    dragStart() {

        this.div.className += " hold";
        draggingResource = this;

        let draggingEvent = new Event("dragging");
        this.game.div.dispatchEvent(draggingEvent)

        setTimeout(() => (this.div.className = "invisible"), 0)
    }


    dragEnd() {
        let draggingEvent = new Event("draggingend");
        this.game.div.dispatchEvent(draggingEvent)
        draggingResource = null;
        this.div.className = this.classNameDefault;
    }
}