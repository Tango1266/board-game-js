import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";
import NumberSlot from "../../board/numberslot-component/numberslot";
import { SlotType, slotTypes } from "../../../types";

let idCounter = 0;

export default class Resource extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: details.type.name + "" + id,
            className: "resource " + details.type.name,
            div: document.createElement("div")
        })
        this.draggingObject = null;
        this.position = null;
        this.idCounter = id;
        this.game = game;
        this.type = details.type;

        this.isDraggable = true;
        this.diceNum = 0;

        this.lastPlayed = null;

        this.image = new MyHtmlElement({ div: document.createElement("img"), id: "img-" + details.type.name + "" + id, src: details.imgSource, className: "img-resource", draggable: true });
        this.numberSlot = new NumberSlot(this.game, new SlotType(slotTypes.resourceNumber));
    }

    isCorner() {
        return this.parent.type.isCorner;
    }

    init() {
        this.numberSlot.init();
        this.draggingObject = new DraggingObject(this).init();
        this.add(this.image);
        this.add(this.numberSlot);
        this.parent.add(this);
    }

    isPlayed() {
        return !this.isDraggable;
    }
    setBoardPosition(pos) {
        this.position = pos;
        this.numberSlot.position = pos;
    }

    setPlayed() {
        this.isDraggable = false;
        this.image.isDraggable = false;
        this.style.margin = null;
        this.lastPlayed = this;
        setTimeout(() => this.addClass("played-" + this.type.slotType.name), 50)
    }

    onDragStart() {
        console.log("start")
        this.draggingObject.startDragging();
        this.className += " hold";
        setTimeout(() => (this.hide()), 0)
    }

    onDragEnd() {
        console.log("end")
        this.draggingObject.endDragging();
        this.changeClass(this.classNameDefault);
    }

}