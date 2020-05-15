import MyHtmlElement from "../../htmlElement";
import { slotTypes } from "../../../types";

let idCounter = 0;

export let draggingCard;

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

        this.game = game;
        this.type = details.type;
        this.backside = details.backside;
        this.isPlayed = false;

        this.imgCard = new MyHtmlElement({
            id: "img-" + details.type.name + "-" + id,
            className: "img-card img-"+ details.type.slotType.name,
            div: document.createElement("img"),
            parent: this,
            src: details.imgSource
        })
    }

    init() {
        this.parent.add(this);
        this.add(this.imgCard);
        this.setUnplayed();
        this.initEventListener();
    }

    initEventListener() {
        this.div.ondragstart = this.dragStart.bind(this);
        this.div.ondragend = this.dragEnd.bind(this);
    }

    isPlayed() {
        return this.div.classList.contains("played-" + this.type.slotType.name);
    }

    setPlayed() {
        draggingCard = null;
        this.isPlayed = true;
        setTimeout(() => this.flipCard()
            .changeClass(this.classNameDefault)
            .addClass(this.type.slotType.name)
            .addClass("played-" + this.type.slotType.name).imgCard.addClass("played-img-" + this.type.slotType.name), 50)
    }

    flipCard() {
        let backsideImg = this.backside.div.src;
        this.backside.div.src = this.imgCard.div.src;
        this.imgCard.div.src = backsideImg;

        return this;
    }

    setUnplayed() {
        this.div.draggable = true;
        setTimeout((() => {
            this.div.width = this.parent.div.clientHeight;
            this.div.height = this.parent.div.clientWidth;
            this.changeClass(this.classNameDefault)
                .addClass(this.type.slotType.name)
                .addClass("rotate");
        }), 0);
        return this;
    }



    dragStart(e) {
        draggingCard = this;

        this.hide().addClass("hold")
            .removeClass("rotate").flipCard();
        let draggingEvent = new Event("dragging");
        this.game.div.dispatchEvent(draggingEvent)
    }

    dragEnd() {
        if (this.isPlayed) return;

        this.flipCard();
        let draggingEvent = new Event("draggingend");
        this.game.div.dispatchEvent(draggingEvent);
        this.setUnplayed();
    }
}