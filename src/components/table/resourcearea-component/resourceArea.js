import MyHtmlElement from "../../htmlElement";
import ResourceSlotHelper from "../../../ruleEngine/resourceSlotHelper";
import ResourceNumber from "../../gameobjects/resourceNumber-component/resourceNumber";
import { resourceTypes } from "../../../types";


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
        const firstSlotCandidates = this.game.board.resourceSlots.filter(slot => slot.isCorner());
        this.firstSlot = firstSlotCandidates[Math.floor(Math.random() * firstSlotCandidates.length)];

        let times = Math.floor(Math.random() * 130);
        while (--times > 0) {
            for (let i = this.getChildren().length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                this.getChildren()[i].addAfter(this.getChildren()[j])
            }
        }
    }

    allocateResources() {
        const template = this.game.board.resourceSlotTemplate;
        const slotHelper = new ResourceSlotHelper(template);
        const playedRes = this.game.board.resources;

        
        let nextSlot = this.firstSlot || slotHelper.getSlot(0,2);
        if(playedRes.length > 0) {
            let lastPlayed = playedRes[playedRes.length -1];
            nextSlot = slotHelper.findNextSlot(lastPlayed.parent.position.boadCol, lastPlayed.parent.position.boardRow);
        }
        
        let char = 'A';
        let resNums = ResourceNumber.orderedResNums.map((num) => {
            let resNum = new ResourceNumber(this.game, {value:num, char:char});
            char = String.fromCharCode(char.charCodeAt(0) + 1);
            resNum.init();
            return resNum;
        });
        
        // firstSlot only initalized when player use shuffle
        if(!this.firstSlot) {
            let startOrderedNums = ['G', 'B','F','H','M','E','A','C','I','O','K','L','J','P','R','D','N','Q',];
            let startOrderedResNums = [];
            let i = 0;
            while(i < startOrderedNums.length){
                startOrderedResNums.push(resNums.find(resNum => resNum.char === startOrderedNums[i]));
                i++;
            }
            resNums = startOrderedResNums;
        }
       
        while(nextSlot != null) {
            const resource = this.getChild();
            nextSlot.add(resource);
            if(!resource.type.isEqual(resourceTypes.dessert))
                resource.add(resNums.shift());
            const col = nextSlot.position.boadCol;
            const row = nextSlot.position.boardRow;
            nextSlot = slotHelper.findNextSlot(col, row);
        }
    }
}