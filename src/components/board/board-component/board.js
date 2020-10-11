import MyHtmlElement from "../../htmlElement";


export default class Board extends MyHtmlElement {

    constructor({ game = null, buildingSlots = [], resourceSlots = [] } = {}) {
        super({
            parent: new MyHtmlElement({ div: document.getElementById("board-container") }),
            id: "board",
            className: "board",
        })
        
        this.resourceSlotTemplate = [];
        
        this.buildingSlots = buildingSlots;
        this.resourceSlots = resourceSlots;
        
        this.resources = [];
        this.game = game;
    }

    init() {
        this.parent.add(this);
        this.resourceSlots.forEach((res) => res.init());
        this.buildingSlots.forEach((bs) => {
            bs.init();
        });

        this.adjustDimensionsToContent();
    }

    addResource(res) {
        this.resources.push(res);
    }
}