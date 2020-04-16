import { addCSSRule, addClass, changeClass } from "./domUtils";

let idCounter = 0;

export let draggingBuilding;

export let TYPES = {
    "town": { name: "town", category: "building"},
    "street": {name:"street", category: "street"},
    "village": { name: "village", category: "building"}
}

export default class Building {
    constructor(game, details) {
        this.game = game;
        this.type = details.type;
        this.owner = details.player;
        this.divOwnerArea = details.ownerArea;

        this.classNameDefault = "game-object " + this.type.name;
        this.div = document.createElement("img");
        this.div.id = "player" +this.owner + "-" + this.type.name + "" +idCounter++; 
        this.div.className = this.classNameDefault;
       
        this.div.draggable = true;
    
        addCSSRule(document.styleSheets[0], "." +this.type.name ,"filter: " + details.color )
        this.div.src = details.imgSource;
    }

    initEventListener() {
        this.div.ondragstart = this.dragStart.bind(this);
        this.div.ondragend = this.dragEnd.bind(this);
    }

    isPlayed() {
        return this.div.draggable;
    }

    setPlayed() {
        this.div.draggable = false;
        setTimeout(() => addClass(this, "played-" + this.type.name), 100)
    }

    setUnplayed() {
        this.div.draggable = true;
        setTimeout(() => changeClass(this, this.classNameDefault), 0)
    }

    draw() {
        this.divOwnerArea.appendChild(this.div);
        this.initEventListener();
    }

    dragStart() {
        this.div.className += " hold";
        draggingBuilding = this;
        
        let draggingEvent = new Event("dragging");
        this.game.dispatchEvent(draggingEvent)

        setTimeout(() => (this.div.className = "invisible"), 0)
    }

    dragEnd() {

        let draggingEvent = new Event("draggingend");
        this.game.dispatchEvent(draggingEvent)

        this.div.className = this.classNameDefault;
    }
}