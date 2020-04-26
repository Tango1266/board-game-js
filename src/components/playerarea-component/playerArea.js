import MyHtmlElement from "../htmlElement";

export default class PlayerArea extends MyHtmlElement{
    constructor(owner) {
        super({
            div: document.getElementById("player-area-" + owner.id)
        })
        this.owner = owner;
    }

    init() {
        for (var gameObjects in this.owner.gameObjects) {
            for (var gameObject of this.owner.gameObjects[gameObjects]) {
                gameObject.init();
            }
        }
    }
    
}