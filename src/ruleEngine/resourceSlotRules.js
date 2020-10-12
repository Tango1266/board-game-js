import ResourceSlotHelper from "./resourceSlotHelper";

export class ResourceSlotRules {
    constructor(game, slot, resource, logResult) {
        this.game = game;
        this.slot = slot;
        this.resource = resource;

        this.logResult = logResult || true;
        this.lastResult = "";

        const slotTemplate = this.game.board.resourceSlotTemplate;
        this.slotHelper = new ResourceSlotHelper(slotTemplate);

    }

    allowed() {
        const currentPhase = this.game.currentPhase;
        const phase = this.game.GAME_PHASES;

        if (currentPhase != phase.PREPARE)
            return false;

        return this.onlyEmpty() && this.firstOnlyAtCorners() && this.onlyCounterClockWise();

    }

    onlyEmpty() {
        return this.slot.isEmpty();
    }

    firstOnlyAtCorners() {
        //determin if it is first: 
        // first, if number of childs of resArea equals number of slots
        let isFirst = this.game.board.resourceSlots.length == this.resource.parent.getChildren().length;

        if (isFirst)
            return this.slot.isCorner();

        return true;
    }

    onlyCounterClockWise() {
        let countPlayedRes = this.game.board.resources.length;

        if (countPlayedRes < 1)
            return true;

        let lastPlayedRes = this.game.board.resources[countPlayedRes - 1];

        const col = lastPlayedRes.parent.position.boadCol;
        const row = lastPlayedRes.parent.position.boardRow;
        
        const next = this.slotHelper.findNextSlot(col, row);
        if (!next) return false;
        
        return this.slot.id === next.id;
    }
}
