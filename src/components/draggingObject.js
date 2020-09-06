let draggingObjectCache = null;

export default class DraggingObject  {

    /**
     * @param {*} param0 Instance of dragging object OR json-object for customiziations
     */
    constructor({draggingObject = null, dragStartHandler = null, dragEndHandler = null, draggingStartHandler = null, draggingEndHandler = null} = {}){
        // if only one arg is passed, it must be the instance of the dragging object
        this.draggingObject = draggingObject || arguments[0];

        this.dragStartHandler = dragStartHandler || this.draggingObject.onDragStart;
        this.dragEndHandler = dragEndHandler || this.draggingObject.onDragEnd;
        this.draggingStartHandler = draggingStartHandler || this.doOnDragging;
        this.draggingEndHandler = draggingEndHandler || this.doOnDraggingEnd;
    }

    init() {
        this.initDragEventListener();
        return this;
    }

    initDragEventListener() {
        this.draggingObject.event.ondragstart.do(this.dragStartHandler);
        this.draggingObject.event.ondragend.do(this.dragEndHandler);
    }

    static getDraggingObject({} = {}) {
     return draggingObjectCache;
    }

    startDragging() {
        if(draggingObjectCache) return;
        this.draggingObject.game.event.emit("dragging", this.draggingObject);
        draggingObjectCache = this.draggingObject;
    }

    endDragging() {
        this.draggingObject.game.event.emit("draggingend", this.draggingObject);
        draggingObjectCache = null;
        console.log(draggingObjectCache)
    }

    notifyDraggingStart(gameObject) {
        this.game.event.emit("dragging", {[this.type.slotType.name] : gameObject.id});
    }

    notifyDraggingEnd(gameObject) {
        this.game.event.emit("draggingend");
    }

}