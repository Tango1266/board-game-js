import { draggingResource } from "../../gameobjects/resource-component/resource";
import MyHtmlElement from "../../htmlElement";

let idCounter = 0;

export default class ResourceSlot extends MyHtmlElement{

    constructor(game, board, position) {
        super({
            id: "hexagon_" + idCounter++,
            className: "hexagon"
        })
        this.game = game;
        this.board = board;
        this.position = position;
        this.type = null;
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

        this.game.event.on("dragging", this.dragStart, this);
        this.game.event.on("draggingend", this.dragEnd, this);
    }

    dragStart() {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
       
        // let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        if (this.isEmpty && draggingResource.type.slotType.isEqual(this.type)
            /*&& buildingRules.allowed()*/) {
            addClass(this, "empty");
        }
    }

    dragOver(e) {
        if (!this.isEmpty || !draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        e.preventDefault();
    }

    dragEnter(e) {
        if (!this.isEmpty || !draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        e.preventDefault();
        this.addClass("hovered");
    }

    dragLeave() {
        if (!this.isEmpty || !draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        this.changeClass(this.lastClassname);
    }

    dragDrop(e) {
        e.preventDefault();
        if (!this.isEmpty || !draggingResource || !draggingResource.type instanceof ResourceSlot) return;

        // reset highlighting and add
        this.changeClass(this.classNameDefault)
        this.add(draggingResource, () => draggingResource.setPlayed());
    }

    dragEnd() {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        this.changeClass(this.classNameDefault)
    }
}