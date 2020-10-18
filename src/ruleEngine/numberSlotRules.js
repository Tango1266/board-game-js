import NumberSlotHelper from "./numberSlotHelper";
import { slotTypes, resourceTypes } from "../types";

export class NumberSlotRules {
    constructor(game, slot, resNum, logResult) {
        this.game = game;
        this.slot = slot;
        this.resNum = resNum;

        this.logResult = logResult || true;
        this.lastResult = "";

        const slotTemplate = this.game.board.resourceSlotTemplate;
        this.slotHelper = new NumberSlotHelper(slotTemplate);
        this.isFirst = false;
    }

    allowed() {
        const currentPhase = this.game.currentPhase;
        const phase = this.game.GAME_PHASES;

        if (currentPhase != phase.PREPARE)
            return false;

        this.isFirst = this.game.board.resourceNumbers.length < 1;
        if (!this.onlyOnResources()) return false;

        if (this.isFirst)
            return this.onlyEmpty() && this.firstOnlyAtCorners();
            
        return this.onlyEmpty() && this.onlyCounterClockWise();

    }

    onlyOnResources() {
        const parent = this.slot.parent;
        if (!parent || !parent.type) return false;
        const isParentResource = parent.type.slotType.isEqual(slotTypes.resource);
        return isParentResource;
    }

    onlyEmpty() {
        return this.slot.isEmpty;
    }

    firstOnlyAtCorners() {
        this.isParentDessert = this.slot.parent.type.isEqual(resourceTypes.dessert);
        return this.slot.isCorner() && !this.isParentDessert;
    }

    onlyCounterClockWise() {
        let countPlayedNums = this.game.board.resourceNumbers.length;

        if (countPlayedNums < 1)
            return true;

        let lastPlayedNum = this.game.board.resourceNumbers[countPlayedNums - 1];

        const col = lastPlayedNum.position.boadCol;
        const row = lastPlayedNum.position.boardRow;

        const next = this.slotHelper.findNextSlot(col, row);
        if (!next) return false;

        return this.slot.id === next.id;
    }
}