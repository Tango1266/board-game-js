import PlayerArea from "./components/table/playerarea-component/playerArea";
import Hand from "./components/table/hand-component/hand";

let playerId = 1;

export default class Player {
    constructor(game, name) {
        this.id = playerId++;
        this.game = game;
        this.name = name;
        this.gameObjects = null;
        this.area = new PlayerArea(this);
        this.hand = new Hand(this);
    }

    init() {
        this.area.init();
        this.hand.init();
    }
}