import MyHtmlElement from "./htmlElement";
import ResourceFactory from "./resourceFactory";
import 'regenerator-runtime/runtime'

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

function* transformPos() {
    let i = 0;
    while (true) {
        while (i++ < 3) yield "marginLeft";
        while (i-- > 0) yield "marginTop";
        while (i++ < 3) yield "marginRight";
        while (i-- > 0) yield "marginBottom";
    }
}
let margin = transformPos();

export default class ResourceArea extends MyHtmlElement {
    constructor(game) {
        super({
            parent: new MyHtmlElement({ div: document.getElementById("resource-area-container") }),
            div: document.getElementById("resource-area")
        })

        this.game = game;
        this.resources = {};
    }

    init() {
        let rf = new ResourceFactory();
        this.resources = {
            ore: rf.createOre(this.game, 3),
            corn: rf.createCorn(this.game, 4),
            stone: rf.createStone(this.game, 3),
            wool: rf.createWool(this.game, 4),
            wood: rf.createWood(this.game, 4),
            dessert: rf.createDessert(this.game, 1),
        };
    }

    draw() {
        this.parent.add(this);

        for (var resKey in this.resources) {
            for (var resource of this.resources[resKey]) {
                resource.parent = this;

                let previousEl = this.div.children[resource.idCounter - 1];
                if (previousEl) {

                    let marginnext = margin.next().value;
                    switch (marginnext) {
                        case "marginLeft":
                            resource.div.style.marginLeft = previousEl.offsetLeft + 10 + "px";
                            break;
                        case "marginTop":
                            resource.div.style.marginTop = previousEl.offsetTop + 10 + "px";
                            resource.div.style.marginLeft = previousEl.offsetLeft + "px";
                            break;
                        case "marginRight":
                            resource.div.style.marginTop = previousEl.offsetTop + "px";
                            resource.div.style.marginLeft = previousEl.offsetLeft - 10 + "px";
                            break;
                        case "marginBottom":
                            resource.div.style.marginTop = previousEl.offsetTop - 10 + "px";
                            resource.div.style.marginLeft = previousEl.offsetLeft + "px";
                            break;
                    }
                }
                resource.draw();
            }
        }

        this.initEventListener();
    }

    initEventListener(){
        this.div.addEventListener("DOMNodeRemoved", this.makeDelayCallback(this.onDomNodeRemoved))
    }

    onDomNodeRemoved(e){
        if(this.isEmpty()){
            this.parent.addClass("invisible");
        }

    }

    shufle(div) {
        let times = Math.floor(Math.random() * 20);
        while(times-- > 0){
            shuffleDivChildren(div);
        } 
    }

    allocateResources(resources) {
        let countSlot = 0;
        for (let i = resources.length - 1; i >= 0; i--) {
            let ress = MyHtmlElement.getElementById(resources[i].id)

            if (this.game.board.resourceSlots[countSlot].isEmpty())
                this.game.board.resourceSlots[countSlot].add(ress);
            else
                i++;

            countSlot++;
        }
    }
}