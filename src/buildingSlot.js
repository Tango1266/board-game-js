import { draggingBuilding, TYPES } from "./building";
import {addClass, changeClass, removeClass} from "./domUtils";
import BuildingRules from "./ruleEngine";
import { SlotType } from "./types";

let idCounter = 0;

export default class BuildingSlot {

    constructor(game, board, position, type, mods) {
        this.div = document.createElement("div");
        this.classNameDefault = "circle";
        this.lastClassname = this.classNameDefault;
        this.div.className = this.classNameDefault;

        this.div.id = type.name + "_slot" + idCounter++;

        this.type = type;
        this.game = game;
        this.board = board;
        this.position = position;
     
        this.mods = mods;
        this.currBuilding = null;

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
        this.currBuilding = building
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
        if (!draggingBuilding || !draggingBuilding.type instanceof BuildingSlot) return;
        let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        if (this.isEmpty() && draggingBuilding.type.slotType.name === this.type.name 
            && buildingRules.allowed()) {
            addClass(this, "empty");
        }
    }

    dragOver(e) {
        if (!draggingBuilding || !draggingBuilding.type instanceof BuildingSlot) return;
        e.preventDefault();
    }

    dragEnter(e) {
        if (!draggingBuilding || !draggingBuilding.type instanceof BuildingSlot) return;
        e.preventDefault();
        // this.addClass("hovered");
        addClass(draggingBuilding, "hovered");
    }

    dragLeave() {
        if (!draggingBuilding || !draggingBuilding.type instanceof BuildingSlot) return;
        // this.changeClass(this.lastClassname);
        changeClass(this, this.lastClassname)

    }

    dragDrop(e) {
        e.preventDefault();
        if (!draggingBuilding || !draggingBuilding.type instanceof BuildingSlot ) return;

        let buildingRules = new BuildingRules(this.game, this, draggingBuilding);
        if (!buildingRules.allowed()) {
            console.log("not allowed")
            return;
        }
        
        if(draggingBuilding.type.name == TYPES.town.name) 
        {
            const playerArea = document.getElementById("player-area-" + draggingBuilding.owner);
            let lastBuilding = this.currBuilding;
            playerArea.append(lastBuilding.div);
            lastBuilding.setUnplayed();
        }

        // reset highlighting and add
        changeClass(this, this.classNameDefault)
        this.addBuilding(draggingBuilding);

        // restyle dragged gameobject - delay needed setTimeout
        if (this.type.isLeftUpper || this.type.isRightUpper) {
            let classSuffix = this.type.isLeftUpper ? "left-upper": "right-upper";
            setTimeout(() => addClass(draggingBuilding, this.type.name + "-" + classSuffix), 0)
            console.log(this.type)
            
        }

        setTimeout(() => draggingBuilding.setPlayed(), 0);
    }

    dragEnd() {
        if (!draggingBuilding || !draggingBuilding.type instanceof BuildingSlot) return;
            this.div.className = this.classNameDefault;
    }
}