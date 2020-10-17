import MyHtmlElement from "../../htmlElement";
import DraggingObject from "../../draggingObject";
import ResourceNumber from "../resourceNumber-component/resourceNumber";

let idCounter = 0;

export default class Resource extends MyHtmlElement {
    constructor(game, details) {
        let id = idCounter++;
        super({
            id: details.type.name + "" + id,
            className: "resource " + details.type.name,
            div: document.createElement("div")
        })
       
        this.image = new MyHtmlElement({div: document.createElement("img"), id: "img-" + details.type.name + "" + id, src: details.imgSource, className: "img-resource", draggable: true});
        this.draggingObject = null;

        this.idCounter = id;
        this.game = game;
        this.type = details.type;

        this.isDraggable = true;
        this.diceNum = 0;

        this.lastPlayed = null;
    }

    init() {
        this.draggingObject = new DraggingObject(this).init();
        this.add(this.image);
        this.parent.add(this);

        this.event.ondragover.do(this.dragOver);
        this.event.ondragenter.do(this.dragEnter);
        this.event.ondragleave.do(this.dragLeave);
        this.event.ondrop.do(this.dragDrop), this;

        this.game.event.on("dragging").do(this.draggingStart, this);
        this.game.event.on("draggingend").do(this.draggingEnd, this);
    }

    isPlayed() {
        return !this.isDraggable;
    }

    setPlayed() {
        this.isDraggable = false;
        this.image.isDraggable = false;
        this.style.margin = null;
        this.lastPlayed = this;
        setTimeout(() => this.addClass("played-" + this.type.slotType.name), 50)
    }

    draggingStart() {
        console.log("draggingStart")
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        let resourceSlotRules = new ResourceSlotRules(this.game, this, draggingResource);
        if(resourceSlotRules.allowed())
            this.addClass("empty");
    }

    draggingEnd() {
        console.log("draggingEnd")
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource) return;
        this.changeClass(this.classNameDefault)
    }

    onDragStart() {
        console.log("start")
        this.draggingObject.startDragging();
        this.className += " hold";
        setTimeout(() => (this.hide()), 0)
    }

    onDragEnd() {
        console.log("end")
        this.draggingObject.endDragging();
        this.changeClass(this.classNameDefault);
    }

    dragLeave() {
        console.log("leave")
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        this.changeClass(this.lastClassname);
    }

    dragEnter(e) {
        console.log(e)
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();
        this.addClass("hovered");
    }
    dragOver(e) {
        console.log("over")
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        console.log(this.image.isEmpty, draggingResource)
        if (!draggingResource || !this.image.isEmpty) return;
        e.preventDefault();
    }

    //todo: drops on img, does not work
    dragDrop(e) {
        console.log("drop")
        const draggingResource = DraggingObject.getDraggingObject(this.type);
        if (!draggingResource || !this.isEmpty) return;
        e.preventDefault();

        // let resourceSlotRules = new ResourceSlotRules(this.game, this, draggingResource);
        // if(!resourceSlotRules.allowed()) return;
        // reset highlighting and add
        this.changeClass(this.classNameDefault)
        this.add(draggingResource, () => draggingResource.setPlayed());
    }
}