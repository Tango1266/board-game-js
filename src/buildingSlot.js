import { draggingBuilding, TYPES } from "./building";
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
        let buildingRules = new BuildingRules(this.game, this, draggingBuilding);

        if (this.isEmpty() && draggingBuilding.type.category === this.type 
            && buildingRules.allowed()) {
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
        if (this.mods.streetMod !== "") {
            setTimeout(() => addClass(draggingBuilding, this.type + "-" + this.mods.streetMod), 0)
        }

        draggingBuilding.setPlayed();
    }

    dragEnd() {
        this.div.className = this.classNameDefault;
    }
}