import MyHtmlElement from "../../htmlElement";
import getImageByName from "../../../imageManager";
import Card, { draggingCard } from "../../gameobjects/card-component/card";

let idCounter = 0;

export default class Hand extends MyHtmlElement {

    constructor(player) {
        super({
            id: "hand-" + player.id,
            className: "hand hand-" + player.id,
            div: document.createElement("div"),
            parent: new MyHtmlElement({ div: document.getElementsByTagName("body")[0] })
        })

        this.owner = player;

        this.holdingCards = new MyHtmlElement({
            id: "holding-cards-" + this.owner.id,
            className: "holding-cards holding- cards - " + this.owner.id,
            div: document.createElement("div"),
            parent: this
        })
        this.div.style.gridArea = "hand" + player.id;
    }

    addCard(card) {


        let prevCardDiv = this.holdingCards.div.children[this.holdingCards.div.children.length - 1];
        let rotationValue = 0;
        console.log(this.div.clientWidth, this.div.clientHeight)
        console.log(this.div.offsetLeft, this.div.offsetHeight)
        if (prevCardDiv) {
            let prevRotationValue = parseInt(prevCardDiv.style.transform.replace(/[^\d\+\-]/g, ""));
            let prevOffsetLeft = prevCardDiv.offsetLeft;
            let prevOffsetButtom = prevCardDiv.offsetHeight;

            console.log(prevOffsetLeft, prevOffsetButtom)
            rotationValue = prevRotationValue + 15;

            let offsetLeft = 0.07 + (prevOffsetLeft / this.div.clientWidth)
            card.div.style.left =  Math.round(offsetLeft * 100) + "%";
            

            // card.div.style.bottom =  Math.round(offsetButtom * 100) + "%";
        }
            // card.div.style.left = idCounter++ * -10 + "%";
        else { //(((card.clientWidt/2 + this.div.clientWidth / 2) / this.div.clientWidth )* 100 )
            card.div.style.left =  10 + "%";
        }
        card.div.style.transform = "rotate(" + rotationValue + "deg)";
        console.log(card.isOverflown)

        this.holdingCards.add(card);

        return this;
    }

    init() {
        this.parent.add(this);

        // Hand
        this.add(new MyHtmlElement({
            id: "img-hand-" + this.owner.id,
            className: "img-hand img-hand-" + this.owner.id,
            div: document.createElement("img"),
            src: getImageByName("hand"),
            parent: this
        }))

        // thumb
        .add(new MyHtmlElement({
                id: "img-thumb-" + this.owner.id,
                className: "img-hand img-hand-" + this.owner.id + " img-thumb",
                div: document.createElement("img"),
                src: getImageByName("thumb"),
                parent: this
            }))
            // Cards container
            .add(this.holdingCards);

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
        this.addCard(draggingCard);
        draggingCard.isPlayed = true;
        setTimeout(() => draggingCard.setPlayed(), 0)
    }

    dragEnd() {
        console.log("end")
    }
}