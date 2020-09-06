import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";
import { SlotType, slotTypes } from "../../../types";

let idCounter = 0;

export default class ResourceSlot extends MyHtmlElement {

    constructor(game, board, position) {
        super({
            id: "hexagon_" + idCounter++,
            className: "hexagon"
        })
        this.game = game;
        this.board = board;
        this.position = position;
        this.type = new SlotType(slotTypes.resource.name);
    }

    add(child) {
        this.type = child.type;
        super.add(child, () => child.setPlayed());
    }

    init() {
        this.setPos(this.position.x, this.position.y);
        this.board.add(this);
        this.initEventListener();
    }

    initEventListener() {
        this.event.ondragover.do(this.dragOver);
        this.event.ondragenter.do(this.dragEnter);
        this.event.ondragleave.do(this.dragLeave);
        this.event.ondrop.do(this.dragDrop);

        this.game.event.on("dragging").do(this.draggingStart, this);
        this.game.event.on("draggingend").do(this.draggingEnd, this);
    }

    draggingStart() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        this.addClass("empty");
    }

    dragOver(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();
    }

    dragEnter(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();
        this.addClass("hovered");
    }

    dragLeave() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        this.changeClass(this.lastClassname);
    }

    dragDrop(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();

        // reset highlighting and add
        this.changeClass(this.classNameDefault)
        this.add(draggingResource, () => draggingResource.setPlayed());
    }

    draggingEnd() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource) return;
        this.changeClass(this.classNameDefault)
    }
}