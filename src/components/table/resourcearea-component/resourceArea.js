import MyHtmlElement from "../../htmlElement";

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleDivChildren(div) {
    for (let i = div.children.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        div.insertBefore(div.children[i], div.children[j]);
    }
    return div;
}



export default class ResourceArea extends MyHtmlElement {
    constructor(game, resources) {
        super({
            parent: new MyHtmlElement({ div: document.getElementById("resource-area-container") }),
            div: document.getElementById("resource-area")
        })
        this.game = game;
        this.resources = resources;

        this.parent.div.style.gridArea = "resourceArea";
    }

    init() {
        this.parent.add(this);
        this.addClass("dragscroll")
        this.initEventListener();
    }

    initEventListener() {
        let observer = new MutationObserver(this.makeDelayCallback(this.onDomNodeRemoved));
        observer.observe(this.div, { childList: true });
        // this.div.addEventListener("DOMNodeRemoved", this.makeDelayCallback(this.onDomNodeRemoved))
    }

    onDomNodeRemoved(e) {
        if (this.isEmpty) {
            this.parent.addClass("invisible");
        }

    }

    shufle(div) {
        let times = Math.floor(Math.random() * 20);
        while (times-- > 0) {
            shuffleDivChildren(div);
        }
    }

    allocateResources(resources) {
        let countSlot = 0;
        for (let i = resources.length - 1; i >= 0; i--) {
            let ress = MyHtmlElement.getElementById(resources[i].id)

            if (this.game.board.resourceSlots[countSlot].isEmpty)
                this.game.board.resourceSlots[countSlot].add(ress);
            else
                i++;

            countSlot++;
        }
    }
}