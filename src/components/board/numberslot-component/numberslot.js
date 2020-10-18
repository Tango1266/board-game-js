import DraggingObject from "../../draggingObject";
import MyHtmlElement from "../../htmlElement";
import { NumberSlotRules } from "../../../ruleEngine/numberSlotRules";

let idCounter = 0;

export default class NumberSlot extends MyHtmlElement {
    constructor(game, type) {
        super({
            id: "numberslot_" + idCounter++,
            className: "numberslot"
        })
        this.game = game;
        this.board = game.board;
        this.type = type;
        this.position = null;
    }

    init() {
        this.event.ondragover.do(this.dragOver);
        this.event.ondragenter.do(this.dragEnter);
        this.event.ondragleave.do(this.dragLeave);
        this.event.ondrop.do(this.dragDrop, this);

        this.game.event.on("dragging").do(this.draggingStart, this);
        this.game.event.on("draggingend").do(this.draggingEnd, this);
        return this;
    }

    add(resNum) {
        this.board.addResourceNumber(resNum);
        resNum.setBoardPosition(this.position);
        super.add(resNum);
    }

    isCorner() {
        if (!this.parent.parent.type) return false;
        return this.parent.parent.type.isCorner;
    }

    draggingStart() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        let numberSlotRules = new NumberSlotRules(this.game, this, draggingResource);
        if (numberSlotRules.allowed())
            this.addClass("empty");
    }

    draggingEnd() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource) return;
        this.changeClass(this.classNameDefault)
    }

    dragLeave() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        this.removeClass("hovered");
    }

    dragEnter(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();
        let numberSlotRules = new NumberSlotRules(this.game, this, draggingResource);
        if (numberSlotRules.allowed())
            this.addClass("hovered");
    }

    dragOver(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();
    }

    dragDrop(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();
        let numberSlotRules = new NumberSlotRules(this.game, this, draggingResource);
        if (!numberSlotRules.allowed()) return;
        this.changeClass(this.classNameDefault)
        this.add(draggingResource);
        setTimeout(() => draggingResource.setPlayed(), 0)
    }
}