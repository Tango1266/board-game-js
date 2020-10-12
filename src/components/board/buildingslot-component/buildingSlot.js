import BuildingRules from "../../../ruleEngine/buildingRules";
import MyHtmlElement from "../../htmlElement";
import { buildingTypes } from "../../../types";
import DraggingObject from "../../draggingObject";

let idCounter = 0;

export default class BuildingSlot extends MyHtmlElement {

    constructor(board, position, type) {
        super({
            id: type.name + "_slot" + idCounter++,
            className: "circle",
            div: document.createElement("div"),
            parent: board
        })

        this.type = type;
        this.game = board.game;
        this.position = position;
        this.game.state.removeBuilding(this);
    }

    add(child) {
        super.add(child,
            () => this.game.state.addBuilding(this, child));
        child.buildingSlot = this;
    }

    init() {
        this.setPos(this.position.x, this.position.y)
        this.parent.add(this);

        this.initEventListener();
    }

    initEventListener() {
        this.event.ondragover.do(this.dragOver);
        this.event.ondragenter.do(this.dragEnter);
        this.event.ondragleave.do(this.dragLeave);
        this.event.ondrop.do(this.dragDrop);

        this.game.event.on("dragging").do(this.dragStart, this);
        this.game.event.on("draggingend").do(this.dragEnd, this);
    }

    dragStart() {
        const draggingBuilding = DraggingObject.getDraggingObject(this.type);
        if (!draggingBuilding || !this.isEmpty) return;
        let buildingRules = new BuildingRules(this.game, this, draggingBuilding, false);
        if (buildingRules.allowed()) {
            this.addClass("empty");
        }
    }

    dragOver(e) {
        const draggingBuilding = DraggingObject.getDraggingObject(this.type)
        if (!draggingBuilding) return;
        e.preventDefault();
    }

    dragEnter(e) {
        const draggingBuilding = DraggingObject.getDraggingObject(this.type)
        if (!draggingBuilding) return;
        e.preventDefault();
        // draggingBuilding.addClass("hovered");
    }

    dragLeave() {
        const draggingBuilding = DraggingObject.getDraggingObject(this.type)
        if (!draggingBuilding) return;
        // this.changeClass(this.lastClassname)
    }

    dragDrop(e) {
        e.preventDefault();
        const draggingBuilding = DraggingObject.getDraggingObject(this.type)
        if (!draggingBuilding) return;

        let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        if (!buildingRules.allowed()) {
            console.log("not allowed: ", buildingRules.lastResult)
            return;
        }

        // handle building towns
        if (draggingBuilding.type.isEqual(buildingTypes.town)) {
            let lastBuilding = this.getChild();
            lastBuilding.owner.area.add(lastBuilding);
            lastBuilding.setUnplayed();
        }

        // reset highlighting and add
        this.changeClass(this.classNameDefault)
        this.add(draggingBuilding)

        // restyle dragged gameobject - delay needed setTimeout
        if (this.type.isLeftUpper || this.type.isRightUpper) {
            let classSuffix = this.type.isLeftUpper ? "left-upper" : "right-upper";
            setTimeout(() => draggingBuilding.addClass(this.type.name + "-" + classSuffix), 0)
        }

        setTimeout(() => draggingBuilding.setPlayed(), 0);
    }

    dragEnd() {
        const draggingBuilding = DraggingObject.getDraggingObject(this.type);
        if (!draggingBuilding) return;
        this.changeClass(this.classNameDefault);
    }
}