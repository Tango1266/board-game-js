import MyHtmlElement from "../../htmlElement";
import Board from "../../board/board-component/board";

const GAME_PHASES = {
    NOTINITALISED: 0,
    POPULATE: 1,
    START: 2
}

export default class Table extends MyHtmlElement {

    constructor({players = [], state = {}} = {}) {
        super({
            div: document.getElementById("table"),
        })
        this.players = players;
        this.state = state;
        
        this.GAME_PHASES = GAME_PHASES;
        this.currentPhase = GAME_PHASES.NOTINITALISED;

        this.board = new Board(this);
    }

    get buildingState() { return this.state.buildingSlots;}

    init() {
        this.currentPhase = GAME_PHASES.POPULATE;
        this.board.init();
        this.players.forEach((p) => p.init())
        return this;
    }
}