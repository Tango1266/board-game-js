import { addCSSRule, addClass, changeClass } from "./domUtils";
import ResourceSlot from "./resourceSlot";

let idCounter = 0;

export let draggingResource;

export let TYPES = {
    "wool": { name: "wool"},
    "ore": { name: "ore"},
    "stone": { name: "stone"},
    "corn": { name: "corn" },
    "wood": { name: "wood" },
    "dessert": { name: "dessert"},
}

export default class Resource {
    constructor(game, details) {
        this.game = game;
        this.type = details.type;

        this.classNameDefault = "resource " + this.type.name;
        this.div = document.createElement("img");
        this.div.id = this.type.name + "" + idCounter++;
        this.div.className = this.classNameDefault;
        this.div.style.marginLeft = (idCounter -1) * 10  + "px";
        this.div.draggable = true;

        this.div.src = details.imgSource;
    }

    initEventListener() {
        this.div.ondragstart = this.dragStart.bind(this);
        this.div.ondragend = this.dragEnd.bind(this);
    }

    isPlayed() {
        return !this.div.draggable;
    }

    setPlayed() {
        this.div.draggable = false;
        this.div.style.marginLeft = null;
        setTimeout(() => addClass(this, "played-" + this.type.slotType.name), 50)
    }

    draw() {
        let container = document.getElementById("resource-area");
        container.appendChild(this.div);
        this.initEventListener();
    }

    dragStart() {

        this.div.className += " hold";
        draggingResource = this;

        let draggingEvent = new Event("dragging");
        this.game.div.dispatchEvent(draggingEvent)

        setTimeout(() => (this.div.className = "invisible"), 0)
    }


    dragEnd() {
        let draggingEvent = new Event("draggingend");
        this.game.div.dispatchEvent(draggingEvent)
        draggingResource = null;
        this.div.className = this.classNameDefault;
    }
}