import MyHtmlElement from "../../htmlElement";
import getImageByName from "../../../imageManager";
import { draggingCard } from "../../gameobjects/card-component/card";

let idCounter = 0;

export default class Hand extends MyHtmlElement {

    constructor(player) {
        super({
            id: "hand-" + player.id,
            className: "hand",
            div: document.createElement("div"),
            parent: new MyHtmlElement({ div: document.getElementsByTagName("body")[0] })
        })

        this.owner = player;
    }

    add(child) {
        super.add(child);
        return this;
    }

    init() {
        this.parent.add(this);
        this.add(new MyHtmlElement({
                id: "img-hand-" + this.owner.id,
                className: "hand hand-" + this.owner.id,
                div: document.createElement("img"),
                src: getImageByName("hand"),
                parent: this
            }))
            .add(new MyHtmlElement({
                id: "img-thumb-" + this.owner.id,
                className: "hand hand-" + this.owner.id,
                div: document.createElement("img"),
                src: getImageByName("thumb"),
                parent: this
            }));
        this.initEventListener();
    }

    initEventListener() {
        this.div.ondragover = this.dragOver.bind(this);
        this.div.ondragenter = this.dragEnter.bind(this);
        this.div.ondrop = this.dragDrop.bind(this);

        this.owner.game.div.addEventListener("dragging", this.dragStart.bind(this))
        this.owner.game.div.addEventListener("draggingend", this.dragEnd.bind(this))
    }

    dragStart() {
        console.log("start")
    }

    dragOver(e) {
        e.preventDefault();
        console.log("over")

    }

    dragEnter(e) {
        e.preventDefault();
        console.log("enter")
    }


    dragDrop(e) {
        e.preventDefault();
        if (!draggingCard) return;
        this.add(draggingCard);
        draggingCard.setPlayed();
    }

    dragEnd() {
        console.log("end")
    }
}