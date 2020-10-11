import MyHtmlElement from "../../htmlElement";


export default class ResourceArea extends MyHtmlElement {
    constructor(game, resources) {
        super({
            parent: new MyHtmlElement({ div: document.getElementById("resource-area-container") }),
            id: "resource-area",
            className: "resource-area"
        })
        this.game = game;
        this.resources = resources;

        this.parent.style.gridArea = "resourceArea";
    }

    init() {
        this.parent.add(this);
        this.initEventListener();
        setTimeout(() => {
            this.adjustDimensionsToContent();
        }, 0)
    }

    initEventListener() {
        // todo: research proper html event handling
        let observer = new MutationObserver(this.makeDelayCallback(this.onDomNodeRemoved));
        observer.observe(this.inspect, { childList: true });
    }

    onDomNodeRemoved(e) {
        if (this.isEmpty) {
            this.parent.addClass("invisible");
            console.log("event emit")
            this.event.emit("boardinitialised", null, null, true);
        }
    }

    shufle() {
        let times = Math.floor(Math.random() * 130);
        while (--times > 0) {
            for (let i = this.getChildren().length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                this.getChildren()[i].addAfter(this.getChildren()[j])
            }
        }
    }

    allocateResources() {
        let countSlot = 0;
        for (let i = this.getChildren().length - 1; i >= 0; i--) {

            if (this.game.board.resourceSlots[countSlot].isEmpty)
                this.game.board.resourceSlots[countSlot].add(this.getChildren()[i]);
            else
                i++;

            countSlot++;
        }
    }
}