import MyHtmlElement from "../../htmlElement";


export default class Board extends MyHtmlElement {

    constructor({ buildingSlots = [], resourceSlots = [] } = {}) {
        super({
            div: document.getElementById("board")
        })
        this.buildingSlots = buildingSlots;
        this.resourceSlots = resourceSlots;
        // this.style.gridArea = "board";
    }

    init() {
        this.resourceSlots.forEach((res) => res.init());

        let maxWidth = 0,
            maxHeight = 0;
        this.buildingSlots.forEach(
            (bs) => {
                bs.init();
                maxWidth = Math.max(maxWidth, bs.position.x + bs.div.clientWidth);
                maxHeight = Math.max(maxHeight, bs.position.y + bs.div.clientHeight);
            });
        
        // set parent dimensions based on content
        this.div.style.width = maxWidth + "px";
        this.div.style.height = maxHeight + "px";
    }
}