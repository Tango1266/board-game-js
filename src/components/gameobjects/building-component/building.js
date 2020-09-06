import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";

let idCounter = 0;

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

    isPlayed() {
        return this.isDraggable;
    }

    setPlayed() {
        this.isDraggable = false;
        setTimeout(() => this.addClass("played-" + this.type.name), 50)
    }

    setUnplayed() {
        this.isDraggable = true;
        setTimeout(() => this.changeClass(this.classNameDefault), 0)
    }

    init() {
        this.draggingObject = new DraggingObject(this)
        .init();
        this.owner.area.add(this);
    }

    onDragStart() {
        this.draggingObject.startDragging();

        this.addClass("hold");
        setTimeout(() => (this.hide()), 0)
    }

    onDragEnd() {
        this.draggingObject.endDragging(); 

        this.changeClass(this.classNameDefault);
    }
}