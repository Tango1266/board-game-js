import MyHtmlElement from "../../htmlElement";
import getImageByName from "../../../imageManager";
import { draggingCard } from "../../gameobjects/card-component/card";

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
        let prevCardsOfType = this.holdingCards.getChildren().filter(e => { return e.type.isEqual(card.type) })

        if (prevCardsOfType.length > 0) {
            card.addAfter(prevCardsOfType[prevCardsOfType.length -1]);
        } else
            card.addTo(this.holdingCards);

        this.adjustCardsPosition()
        return this;
    }

    adjustCardsPosition() {
        let children = this.holdingCards.getChildren();
        let rotationValue = -40;

        for(var idxCurr = 0; idxCurr < children.length; idxCurr++) {
            const idxPrev = idxCurr > 0? idxCurr - 1: 0;

            const prevCardDiv = children[idxPrev].div;
            const card = children[idxCurr];

            if(idxCurr !== idxPrev) {
                console.log(prevCardDiv)
                let prevRotationValue = parseInt(prevCardDiv.style.transform.replace(/[^\d\+\-]/g, ""));
                let prevOffsetLeft = prevCardDiv.offsetLeft;
                const prevOffsetButtom = parseInt(prevCardDiv.style.bottom);
                console.log(prevOffsetButtom)
                rotationValue = prevRotationValue + 15;
    
                let offsetLeft = 0.07 + (prevOffsetLeft / this.div.offsetWidth)
                card.div.style.left = Math.round(offsetLeft * 100) + "%";
            }
            card.div.style.bottom = 0 + "%";
            card.div.style.transform = "rotate(" + rotationValue + "deg)";
            // card.adjustDimensionsToContent();
        }
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
        // console.log("start")
    }

    dragOver(e) {
        e.preventDefault();
        // console.log("over")

    }

    dragEnter(e) {
        e.preventDefault();
        // console.log("enter")
    }


    dragDrop(e) {
        e.preventDefault();
        if (!draggingCard) return;
        this.addCard(draggingCard);
        draggingCard.isPlayed = true;
        setTimeout(() => draggingCard.setPlayed(), 0)
    }

    dragEnd() {
        // console.log("end")
    }
}