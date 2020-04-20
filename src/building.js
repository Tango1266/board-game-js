import MyHtmlElement from "./htmlElement";

let idCounter = 0;

export let draggingBuilding;

export default class Building extends MyHtmlElement {
    constructor(game, details) {
        super({
            id: "player" + details.owner + "-" + details.type.name + "" + idCounter++,
            className: "game-object " + details.type.name,
            div: document.createElement("img"),
            draggable: true,
            src: details.imgSource
        })
        this.game = game;
        this.type = details.type;
        this.owner = details.owner;
        this.playerArea = new MyHtmlElement({ div: details.ownerArea })
        this.div.style.filter = details.color;
    }

    initEventListener() {
        this.div.ondragstart = this.dragStart.bind(this);
        this.div.ondragend = this.dragEnd.bind(this);
    }

    isPlayed() {
        return this.div.draggable;
    }

    setPlayed() {
        this.div.draggable = false;
        draggingBuilding = null;
        setTimeout(() => this.addClass("played-" + this.type.name), 50)
    }

    setUnplayed() {
        this.div.draggable = true;
        setTimeout(() => this.changeClass(this.classNameDefault), 0)
    }

    draw() {
        this.playerArea.add(this);
        this.initEventListener();
    }

    dragStart() {
        this.addClass("hold");
        draggingBuilding = this;
        let draggingEvent = new Event("dragging");
        this.game.div.dispatchEvent(draggingEvent)
        setTimeout(() => (this.changeClass("invisible")), 0)
    }

    dragEnd() {
        let draggingEvent = new Event("draggingend");
        this.game.div.dispatchEvent(draggingEvent)
        this.changeClass(this.classNameDefault);
    }
}