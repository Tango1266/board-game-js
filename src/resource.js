let idCounter = 0;

export default class Resource {

    constructor(game, board, position) {
        this.div = document.createElement("div");
        this.div.className = "hexagon";
        this.div.id = "hexagon_" + idCounter++;

        this.game = game;
        this.board = board;
        this.position = position;

        this.offSetBoardLeft = this.board.offSetBoardLeft;
        this.offSetBoardTop = this.board.offSetBoardTop;
    }

    draw() {
        this.placeDiv(this.position.x, this.position.y)
      
        this.board.div.appendChild(this.div);
    }

    placeDiv(x_pos, y_pos) {
        var d = this.div;
        d.style.position = "absolute";
        if (typeof x_pos === "number") {
            d.style.left = x_pos + 'px';
            d.style.top = y_pos + 'px';
        }
        else if (typeof x_pos === "string") {
            d.style.left = x_pos;
            d.style.top = y_pos;
        }
    }
}