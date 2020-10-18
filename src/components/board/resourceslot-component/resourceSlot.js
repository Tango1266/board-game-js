import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";
import { ResourceSlotRules } from "../../../ruleEngine/resourceSlotRules";

let idCounter = 0;

export default class ResourceSlot extends MyHtmlElement {

    constructor(board, position, type) {
        super({
            id: "hexagon_" + idCounter++,
            className: "hexagon"
        })
        this.game = board.game;
        this.board = board;
        this.position = position;
        this.type = type;
    }

    add(child) {
        this.game.board.addResource(child);
        child.setBoardPosition(this.position);
        super.add(child, () => child.setPlayed());
    }

    isCorner() {
        return this.type.isCorner;
    }

    isEmpty() {
        return this.getChildren().length <= 0;
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
        if (!draggingResource || !this.isEmpty()) return;
        if(this.isEmpty())
            this.addClass("empty");
    }

    dragOver(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty()) return;
        e.preventDefault();
    }

    dragEnter(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty()) return;
        e.preventDefault();
        this.addClass("hovered");
    }

    dragLeave() {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty()) return;
        this.changeClass(this.lastClassname);
    }

    dragDrop(e) {
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty()) return;
        e.preventDefault();

        if(!this.isEmpty()) return;
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