import { draggingResource } from "../../gameobjects/resource-component/resource";
import { addClass, changeClass, removeClass } from "../../../utils/domUtils";
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
        this.setPos(this.position.x, this.position.y)
        this.board.add(this)
        this.initEventListener()
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
        // this.addClass("hovered");
        addClass(this, "hovered");
    }

    dragLeave() {
        if (!this.isEmpty || !draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        // this.changeClass(this.lastClassname);
        changeClass(this, this.lastClassname)

    }

    dragDrop(e) {
        e.preventDefault();
        if (!this.isEmpty || !draggingResource || !draggingResource.type instanceof ResourceSlot) return;

        // reset highlighting and add
        changeClass(this, this.classNameDefault)
        this.add(draggingResource, () => draggingResource.setPlayed());
    }

    dragEnd() {
        if (!draggingResource || !draggingResource.type instanceof ResourceSlot) return;
        this.div.className = this.classNameDefault;
    }
}