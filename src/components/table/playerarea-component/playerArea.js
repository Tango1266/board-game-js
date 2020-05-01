import MyHtmlElement from "../../htmlElement";

export default class PlayerArea extends MyHtmlElement{
    constructor(owner) {
        let id = "player-area-" + owner.id;
        super({
            id: id,
            className: "player-area " + id,
            parent: owner.game
        })
        this.owner = owner;
    }

    init() {
        this.parent.add(this);
        for (var gameObjects in this.owner.gameObjects) {
            for (var gameObject of this.owner.gameObjects[gameObjects]) {
                gameObject.init();
            }
        }
    }
    
}