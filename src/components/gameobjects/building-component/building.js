import MyHtmlElement from "../../htmlElement";

let idCounter = 0;

export let draggingBuilding;

export default class Building extends MyHtmlElement {
    constructor(game, details) {
        super({
            id: "player" + details.owner.id + "-" + details.type.name + "" + idCounter++,
            className: "game-object " + details.type.name,
            div: document.createElement("img"),
            draggable: true,
            src: details.imgSource
        })
        this.game = game;
        this.type = details.type;
        this.owner = details.owner;
        this.color = details.color;
    }

    initEventListener() {
        this.event.ondragstart.do(this.dragStart);
        this.event.ondragend.do(this.dragEnd);
    }

    isPlayed() {
        return this.isDraggable;
    }

    setPlayed() {
        this.isDraggable = false;
        draggingBuilding = null;
        setTimeout(() => this.addClass("played-" + this.type.name), 50)
    }

    setUnplayed() {
        this.isDraggable = true;
        setTimeout(() => this.changeClass(this.classNameDefault), 0)
    }

    init() {
        this.owner.area.add(this);
        this.initEventListener();
    }

    dragStart() {
        this.addClass("hold");
        draggingBuilding = this;
        console.log("building dragstart: ", this)
        this.game.event.emit("dragging")
        setTimeout(() => (this.hide()), 0)
    }

    dragEnd() {
        this.game.event.emit("draggingend")
        this.changeClass(this.classNameDefault);
    }
}