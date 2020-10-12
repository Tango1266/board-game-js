import MyHtmlElement from "../components/htmlElement";

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

export default class ResourceSlotHelper {

    constructor(slottemplate) {
        this.template = slottemplate;
    }

    // console.log("current", row, col)
    getSlot(row, col) {
        // console.log("next", row, col)
        if (col > this.template[row] - 1 || row > this.template.length - 1)
            return null;
        let rows = this.template.slice(0, row + 1);
        let maxSlots = rows.length > 0 ? rows.reduce((acc, cur) => acc + cur) : this.template[row];
        let id = maxSlots - (this.template[row] - col);
        // console.log("countSlots: ", maxSlots, "maxRow: ", this.template[row], "row: ", row, "col: ", col, "id: ", id)
        return MyHtmlElement.getElementById("hexagon_" + id);
    }


    doFindNextSlot(row, col, directions) {
        for (var nextDir of directions) {
            const nextRow = row + nextDir.row;
            let nextCol = col + nextDir.col;
            // console.log("nextCol", nextCol)
            let slot = this.getSlot(nextRow, nextCol);
            if (slot != null && slot.isEmpty())
                return slot;
        }
    }

    findNextSlot(col, row) {
        // when last col => Go up /right, left
        const isLastCol = col == this.template[row] - 1;
        if (isLastCol) {
            // console.log("isLastCol:")
            return this.doFindNextSlot(row, col, [directions.upRight, directions.up, directions.upLeft, directions.left]);
        }

        const isFirstCol = col == 0;
        if (isFirstCol) {
            // console.log("isFirstCol:")
            return this.doFindNextSlot(row, col, [directions.down, directions.downRight, directions.right]);
        }

        const isFirstRow = row == 0;
        if (isFirstRow) {
            // console.log("isFirstRow:")
            return this.doFindNextSlot(row, col, [directions.left, directions.down]);
        }

        const isLastRow = row == this.template.length - 1;
        if (isLastRow) {
            // console.log("isLastRow:")
            return this.doFindNextSlot(row, col, [directions.right, directions.upRight, directions.upLeft]);
        }

        let isUpperBoard = row < Math.floor(this.template.length / 2);
        let isMidBoard = row == Math.floor(this.template.length / 2);
        let isLeftSide = col < Math.floor(this.template[row] / 2);

        // console.log("isUpperBoard && isLeftSide")
        if (isUpperBoard && isLeftSide)
            return this.doFindNextSlot(row, col, [directions.down, directions.downRight]);

        // console.log("isUpperBoard")
        if (isUpperBoard)
            return this.doFindNextSlot(row, col, [directions.left, directions.down]);

        // console.log("!isMidBoard")
        if (!isMidBoard)
            return this.doFindNextSlot(row, col, [directions.right, directions.upRight, directions.up, directions.upLeft]);

        // console.log("isLeftSide")
        if (isLeftSide)
            return this.doFindNextSlot(row, col, [directions.down, directions.downRight, directions.right]);

        // console.log("last")
        return this.doFindNextSlot(row, col, [directions.upLeft, directions.left]);
    }

}