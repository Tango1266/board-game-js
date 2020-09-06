import MyHtmlElement from "../../htmlElement";
import getImageByName from "../../../imageManager";
import DraggingObject from "../../draggingObject";

/* todos: 
    - make n cards on hand visible to player
    - make img-wrapper-div same size as img-div
    - keep originally img ratio when resizing browser
*/
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
        this.style.gridArea = "hand" + player.id;
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

            const prevCard = children[idxPrev];
            const card = children[idxCurr];

            if(idxCurr !== idxPrev) {
                let prevRotationValue = parseInt(prevCard.style.transform.replace(/[^\d\+\-]/g, ""));
                let prevOffsetLeft = prevCard.inspect.offsetLeft;
                rotationValue = prevRotationValue + 15;
    
                let offsetLeft = 0.07 + (prevOffsetLeft / this.inspect.offsetWidth)
                card.style.left = Math.round(offsetLeft * 100) + "%";
            }
            card.style.bottom = 0 + "%";
            card.style.transform = "rotate(" + rotationValue + "deg)";
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
        this.event.ondragover.do(this.dragOver);
        this.event.ondragenter.do(this.dragEnter);
        this.event.ondrop.do(this.dragDrop);
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
        const draggingCard = DraggingObject.getDraggingObject({slotType: this.sl});
        if (!draggingCard) return;
        this.addCard(draggingCard);
        draggingCard.isPlayed = true;
        setTimeout(() => draggingCard.setPlayed(), 0)
    }

    dragEnd() {
        // console.log("end")
    }
}