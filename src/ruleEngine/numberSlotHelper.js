import MyHtmlElement from "../components/htmlElement";
import {resourceTypes } from "../types";

const directions = {
    upRight: { col: 1, row: -1 },
    up: { col: 0, row: -1 },
    upLeft: { col: -1, row: -1 },
    left: { col: -1, row: 0 },
    downLeft: { col: -1, row: 1 },
    down: { col: 0, row: 1 },
    downRight: { col: 1, row: 1 },
    right: { col: 1, row: 0 },
};

export default class NumberSlotHelper {

    constructor(slottemplate) {
        this.template = slottemplate;
    }

    getSlot(row, col) {
        if (col > this.template[row] - 1 || row > this.template.length - 1)
            return null;
        let rows = this.template.slice(0, row + 1);
        let maxSlots = rows.length > 0 ? rows.reduce((acc, cur) => acc + cur) : this.template[row];
        let id = maxSlots - (this.template[row] - col);

        const resSlot = MyHtmlElement.getElementById("hexagon_" + id);
        if (!resSlot) return null;
        if (!resSlot.getChild()) return null;
        return resSlot.getChild().numberSlot;
    }


    doFindNextSlot(row, col, directions) {
        var i = 0;
        for (const nextDir of directions) {
            i++;
            const nextRow = row + nextDir.row;
            let nextCol = col + nextDir.col;
            // console.log("nextCol", nextCol)
            let slot = this.getSlot(nextRow, nextCol);
            if (!slot) continue;

            //todo: unclean - should move type check to numberslotRules
            let isDessert = slot.parent.type.isEqual(resourceTypes.dessert);

            if (slot.isEmpty && !isDessert)
                return slot;

            if (isDessert) {
                return this.findNextSlot(nextCol, nextRow);

            }
        }

        return null;
    }

    findNextSlot(col, row) {
        const pos = this.evaluatePos(col, row);

        if (pos.isLastCol)
            return this.doFindNextSlot(row, col, [directions.upRight, directions.up, directions.upLeft, directions.left]);

        if (pos.isFirstCol)
            return this.doFindNextSlot(row, col, [directions.down, directions.downRight, directions.right]);

        if (pos.isFirstRow)
            return this.doFindNextSlot(row, col, [directions.left, directions.down]);

        if (pos.isLastRow)
            return this.doFindNextSlot(row, col, [directions.right, directions.upRight, directions.upLeft]);

        if (pos.isUpperBoard && pos.isLeftSide)
            return this.doFindNextSlot(row, col, [directions.down, directions.downRight]);

        if (pos.isUpperBoard)
            return this.doFindNextSlot(row, col, [directions.left, directions.down]);

        if (!pos.isMidBoard)
            return this.doFindNextSlot(row, col, [directions.right, directions.upRight, directions.up, directions.upLeft]);

        if (pos.isLeftSide)
            return this.doFindNextSlot(row, col, [directions.down, directions.downRight, directions.right]);

        return this.doFindNextSlot(row, col, [directions.upLeft, directions.left]);
    }

    evaluatePos(col, row) {
        return {
            isLastCol: col == this.template[row] - 1,
            isFirstCol: col == 0,
            isFirstRow: row == 0,
            isLastRow: row == this.template.length - 1,
            isUpperBoard: row < Math.floor(this.template.length / 2),
            isMidBoard: row == Math.floor(this.template.length / 2),
            isLeftSide: col < Math.floor(this.template[row] / 2),
        }
    }
}