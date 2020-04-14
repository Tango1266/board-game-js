import { draggingBuilding } from "./building";
import {addClass, changeClass, removeClass} from "./domUtils";
import BuildingRules from "./ruleEngine";

let idCounter = 0;

export default class BuildingSlot {

    constructor(game, board, position, type, mods) {
        this.div = document.createElement("div");
        this.classNameDefault = "circle";
        this.lastClassname = this.classNameDefault;
        this.div.className = this.classNameDefault;

        this.div.id = type + "_slot" + idCounter++;

        this.type = type;
        this.game = game;
        this.board = board;
        this.position = position;

        this.gameHeight = game.div.clientHeight;
        this.gameWidth = game.div.clientWidth;
        this.mods = mods;

        game.buildingState[mods.row][mods.col] = -1;
      
    }

    isEmpty() {
        return this.div.children.length <= 0;
    }


    draw() {
        this.placeDiv(this.position.x, this.position.y)
        this.board.div.appendChild(this.div);

        this.initEventListener();
    }

    addBuilding(building) {
        this.div.append(draggingBuilding.div)
        this.game.buildingState[this.mods.row][this.mods.col] = 1;
    }

    placeDiv(x_pos, y_pos) {
        var d = this.div;
        d.style.position = "absolute";
        d.style.left = x_pos + 'px';
        d.style.top = y_pos + 'px';
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
        console.log("slot start")
        
        
        if (this.isEmpty()
            && draggingBuilding.type === "village"
            && this.type === "building") {
                // this.addClass("empty");
            addClass(this, "empty");

        }

        // streets
        if (this.isEmpty()
            && draggingBuilding.type === this.type) {
            // this.addClass("empty");
            addClass(this, "empty");
        }
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
        // this.addClass("hovered");
        addClass(draggingBuilding, "hovered");

    }

    dragLeave() {
        // this.changeClass(this.lastClassname);
        changeClass(this, this.lastClassname)

    }

    dragDrop(e) {
        e.preventDefault();
        let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        if (!buildingRules.allowed()) {
            console.log("not allowed")
            return;
        }
       
        // reset highlighting and add
        changeClass(this, this.classNameDefault)
        this.addBuilding(draggingBuilding);

        // restyle dragged gameobject - delay needed setTimeout
        if (this.mods.streetMod !== "") {
            console.log(this.type + "-" + this.mods.streetMod)
            setTimeout(() => addClass(draggingBuilding, this.type + "-" + this.mods.streetMod), 0)
        }
        setTimeout(() => addClass(draggingBuilding, "played-" + draggingBuilding.type), 0)
    }

    dragEnd() {
        this.div.className = this.classNameDefault;
    }
}