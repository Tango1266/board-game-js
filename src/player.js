import PlayerArea from "./components/playerarea-component/playerArea";

let playerId = 1;

export default class Player {
    constructor(game, name) {
        this.id = playerId++;
        this.game = game;
        this.name = name;
        this.gameObjects = null;
        this.area = new PlayerArea(this);
    }

    init() {
        this.area.init();
    }
}