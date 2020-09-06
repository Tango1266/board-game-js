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
        return this.initDragEventListener();
    }

    initDragEventListener() {
        this.draggingObject.event.ondragstart.do(this.dragStartHandler);
        this.draggingObject.event.ondragend.do(this.dragEndHandler);
        return this;
    }

    static getDraggingObject({slotType = arguments[0]} = {}) {
       
     if(!slotType || !draggingObjectCache) return null;
     if(!slotType.isEqual(draggingObjectCache.type.slotType)) return null;
     return draggingObjectCache;
    }

    startDragging() {
        if(draggingObjectCache) return;
        draggingObjectCache = this.draggingObject;
        this.draggingObject.game.event.emit("dragging");
    }

    endDragging() {
        this.draggingObject.game.event.emit("draggingend");
        draggingObjectCache = null;
    }
}