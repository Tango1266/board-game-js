import MyHtmlElement from "../../htmlElement";
import ResourceSlotHelper from "../../../ruleEngine/resourceSlotHelper";
import { resourceTypes } from "../../../types";
import NumberSlotHelper from "../../../ruleEngine/numberSlotHelper";


export default class ResourceArea extends MyHtmlElement {
    constructor(game, resources) {
        super({
            parent: new MyHtmlElement({ div: document.getElementById("resource-area-container") }),
            id: "resource-area",
            className: "resource-area"
        })
        this.game = game;
        this.resources = resources;
        this.numberArea = new MyHtmlElement({ id: "resource-namber-area", className: "number-area" });
        this.parent.style.gridArea = "resourceArea";
        this.isShuffled = false;
    }

    init() {
        this.parent.add(this);
        this.parent.add(this.numberArea);
        this.initEventListener();
        setTimeout(() => {
            this.adjustDimensionsToContent();
        }, 0)
    }

    addResourceNumbers(resourceNumbers) {
        let callback = function (c) {this.turnAround()};
        this.numberArea.addAll(resourceNumbers, callback);
    }

    initEventListener() {
        // todo: research proper html event handling
        let observer = new MutationObserver(this.makeDelayCallback(this.onDomNodeRemoved));
        observer.observe(this.numberArea.inspect, { childList: true });
    }

    onDomNodeRemoved(e) {
        if (this.numberArea.isEmpty) {
            this.parent.addClass("invisible");
            this.event.emit("boardinitialised", null, null, true);
        }
    }

    shufle() {

        this.isShuffled = true;
        let times = Math.floor(Math.random() * 130);
        while (--times > 0) {
            for (let i = this.getChildren().length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                this.getChildren()[i].addAfter(this.getChildren()[j])
            }
        }
    }

    allocateResources() {
         // allocate res
        const allocateNums = !this.getChildren().length > 0;
        const hasPlayedREs = this.game.board.resources.length > 0;
        const needStartOrder = !hasPlayedREs
        if(needStartOrder) 
            this.allocateResourceStartOrder();
        else 
            this.allocateResourceShuffled();
       
        if(allocateNums)
            this.allocateNums();
    }

    allocateResourceShuffled(){
        const emptySlots = this.game.board.resourceSlots.filter((s) => s.isEmpty()).values();
            var nextSlot = emptySlots.next().value;
            while (nextSlot != null) {
                const resource = this.getChild();
                nextSlot.add(resource);
                nextSlot = emptySlots.next().value;
            }
    }

    allocateResourceStartOrder(){
        const template = this.game.board.resourceSlotTemplate;
        const slotHelper = new ResourceSlotHelper(template);
        const playedRes = this.game.board.resources;

        let nextSlot = slotHelper.getSlot(0, 2);
        if (playedRes.length > 0) {
            let lastPlayed = playedRes[playedRes.length - 1];
            nextSlot = slotHelper.findNextSlot(lastPlayed.parent.position.boadCol, lastPlayed.parent.position.boardRow);
        }

        while (nextSlot != null) {
            const resource = this.getChild();
            nextSlot.add(resource);
            const col = nextSlot.position.boadCol;
            const row = nextSlot.position.boardRow;
            nextSlot = slotHelper.findNextSlot(col, row);
        }
    }

    allocateNums(){
         let resNums = this.numberArea.getChildren();
         const firstSlotCandidates = this.game.board.resources.filter(r => r.isCorner());
         const template = this.game.board.resourceSlotTemplate;
         const slotHelper = new NumberSlotHelper(template);
         const playedNums = this.game.board.resourceNumbers;
         const hasPlayedNums = playedNums.length > 0;

         // order nums for start order if not shuffled or manually set nums
         var firstSlot =  firstSlotCandidates[Math.floor(Math.random() * firstSlotCandidates.length)].numberSlot;
         if (!this.isShuffled && !hasPlayedNums) {
             let startOrderedNums = ['G', 'B', 'F', 'H', 'M', 'E', 'A', 'C', 'I', 'O', 'K', 'L', 'J', 'P', 'R', 'D', 'N', 'Q', ];
             let startOrderedResNums = [];
             let i = 0;
             while (i < startOrderedNums.length) {
                 let resNum = resNums.find(resNum => resNum.char === startOrderedNums[i]);
                 resNum.turnAround();
                 startOrderedResNums.push(resNum);
                 i++;
             }
             resNums = startOrderedResNums;
             firstSlot = slotHelper.getSlot(0, 2);
         }
         
         if(hasPlayedNums){
             var lastPlayedNum = playedNums[playedNums.length - 1];
             firstSlot = slotHelper.findNextSlot(lastPlayedNum.position.boadCol, lastPlayedNum.position.boardRow);
         }

         // allocate nums
         var nextSlot = firstSlot;
         while (nextSlot != null) {
             if (!nextSlot.parent.type.isEqual(resourceTypes.dessert)){
                 let num = resNums.shift().setPlayed();
                 nextSlot.add(num);
             }
             const col = nextSlot.position.boadCol;
             const row = nextSlot.position.boardRow;
             nextSlot = slotHelper.findNextSlot(col, row);
         }
    }
}