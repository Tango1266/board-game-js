import DraggingObject from "../../draggingObject";
import MyHtmlElement from "../../htmlElement";

let idCounter = 0;

export default class Card extends MyHtmlElement {

    constructor(game, details) {
        let id = idCounter++;
        super({
            id: details.type.name + "-" + id,
            className: "game-object " + "card",
            div: document.createElement("div"),
            draggable: true,
            parent: details.parent,
            // src: details.imgSource
        })
        this.draggingObject = null;

        this.game = game;

        this.type = details.type;
        this.backside = details.backside;
        this.isPlayed = false;

        this.imgCard = new MyHtmlElement({
            id: "img-" + details.type.name + "-" + id,
            className: "img-card img-" + details.type.slotType.name,
            div: document.createElement("img"),
            parent: this,
            src: details.imgSource
        })
    }

    init() {
        this.draggingObject = new DraggingObject(this)
            .init();
        this.parent.add(this);
        this.add(this.imgCard);
        this.setUnplayed();
    }

    setPlayed() {
        this.isPlayed = true;
        setTimeout(() => this
            .flipCard()
            .changeClass(this.classNameDefault)
            .addClass(this.type.slotType.name)
            .addClass("played-" + this.type.slotType.name)
            .imgCard.addClass("played-img-" + this.type.slotType.name), 50)
    }

    flipCard() {
        let backsideImg = this.backside.imgSrc;
        this.backside.imgSrc = this.imgCard.imgSrc;
        this.imgCard.imgSrc = backsideImg;
        return this;
    }

    setUnplayed() {
        this.isDraggable = true;
        this.isPlayed = false;
        setTimeout((() => {
            this.setWidth(this.parent.inspect.clientHeight)
                .setHeight(this.parent.inspect.clientWidth)
                .changeClass(this.classNameDefault)
                .addClass(this.type.slotType.name)
                .addClass("rotate");
        }), 0);
        return this;
    }

    onDragStart(e) {
        this.draggingObject.startDragging();
        this.hide()
            .addClass("hold")
            .removeClass("rotate")
            .flipCard();
    }

    onDragEnd() {
        this.draggingObject.endDragging(); 
        if (this.isPlayed) return;

        this.flipCard();
        this.setUnplayed();
    }
}