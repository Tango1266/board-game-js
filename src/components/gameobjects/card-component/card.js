import MyHtmlElement from "../../htmlElement";
import { slotTypes } from "../../../types";

let idCounter = 0;

export let draggingCard;

export default class Card extends MyHtmlElement {
    constructor(game, details) {
        super({
            id: details.type.name + "-" + idCounter++,
            className: "game-object " + "card",
            div: document.createElement("img"),
            draggable: true,
            parent: details.parent,
            src: details.imgSource
        })
        this.game = game;
        this.type = details.type;
        this.backside = details.backside;
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
        draggingCard = null;
        setTimeout(() => this.addClass("played-" + this.type.slotType.name), 50)
    }

    flipCard() {
        let backsideImg = this.backside.div.src;
        this.backside.div.src = this.div.src;
        this.div.src = backsideImg;

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
    }

    init() {
        this.parent.add(this);
        this.setUnplayed();
        this.initEventListener();
    }

    dragStart(e) {
        draggingCard = this;

        this.hide().addClass("hold")
            .removeClass("rotate").flipCard();
        let draggingEvent = new Event("dragging");
        this.game.div.dispatchEvent(draggingEvent)
    }

    dragEnd() {
        this.flipCard();
        let draggingEvent = new Event("draggingend");
        this.game.div.dispatchEvent(draggingEvent);
        this.setUnplayed();
    }
}