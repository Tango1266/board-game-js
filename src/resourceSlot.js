import { draggingResource } from "./resource";
import { addClass, changeClass, removeClass } from "./domUtils";

let idCounter = 0;

export default class ResourceSlot {

    constructor(game, board, position) {
        this.div = document.createElement("div");
        this.classNameDefault = "hexagon";
        this.lastClassname = this.classNameDefault;
        this.div.className = this.classNameDefault;

        this.div.id = "hexagon_" + idCounter++;

        this.game = game;
        this.board = board;
        this.position = position;

        this.offSetBoardLeft = this.board.offSetBoardLeft;
        this.offSetBoardTop = this.board.offSetBoardTop;
    }

    isEmpty() {
        return this.div.children.length <= 0;
    }
    addResource(resource) {
        if (resource === undefined) return;

        this.div.append(resource.div)
        resource.setPlayed();
        // this.game.buildingState[this.mods.row][this.mods.col] = 1;
    }


    draw() {
        this.placeDiv(this.position.x, this.position.y)

        this.board.div.appendChild(this.div);
        this.initEventListener()
    }

    placeDiv(x_pos, y_pos) {
        var d = this.div;
        d.style.position = "absolute";
        if (typeof x_pos === "number") {
            d.style.left = x_pos + 'px';
            d.style.top = y_pos + 'px';
        }
        else if (typeof x_pos === "string") {
            d.style.left = x_pos;
            d.style.top = y_pos;
        }
    }
    initEventListener() {
        this.div.ondragover = this.dragOver.bind(this);
        this.div.ondragenter = this.dragEnter.bind(this);
        this.div.ondragleave = this.dragLeave.bind(this);
        this.div.ondrop = this.dragDrop.bind(this);

        this.game.div.addEventListener("dragging", this.dragStart.bind(this))
        this.game.div.addEventListener("draggingend", this.dragEnd.bind(this))
    }

    dragStart() {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
       
        // let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        if (this.isEmpty() && draggingResource.type.slotType.isEqual(this.type)
            /*&& buildingRules.allowed()*/) {
            addClass(this, "empty");
        }
    }

    dragOver(e) {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        e.preventDefault();
        console.log("slot, dragOver")
    }

    dragEnter(e) {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        e.preventDefault();
        // this.addClass("hovered");
        addClass(this, "hovered");
    }

    dragLeave() {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        // this.changeClass(this.lastClassname);
        changeClass(this, this.lastClassname)

    }

    dragDrop(e) {
        e.preventDefault();
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;

        // let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        // if (!buildingRules.allowed()) {
        //     console.log("not allowed")
        //     return;
        // }

        // reset highlighting and add
        changeClass(this, this.classNameDefault)
        this.addResource(draggingResource);

        // // restyle dragged gameobject - delay needed setTimeout
        // if (this.type.isLeftUpper || this.type.isRightUpper) {
        //     let classSuffix = this.type.isLeftUpper ? "left-upper" : "right-upper";
        //     setTimeout(() => addClass(draggingBuilding, this.type.name + "-" + classSuffix), 0)
        // }

       
    }

    dragEnd() {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        this.div.className = this.classNameDefault;
    }
}