import PlayerArea from "./components/table/playerarea-component/playerArea";
import Hand from "./components/table/hand-component/hand";

let playerId = 1;

export default class Player {
    constructor(game, name) {
        this.id = playerId++;
        this.game = game;
        this.name = name;
        this.gameObjects = null;
        
        this.area = null;
        this.hand = null;
    }

    init() {
        this.area.init();
        this.hand.init();
    }

    addHand(hand) {this.hand = hand; return this;}
    
    addArea(area) {this.area = area; return this;}
}