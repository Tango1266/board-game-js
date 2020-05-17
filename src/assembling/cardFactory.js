import { CardType, cardTypes } from "../types";
import getImageByName from "../imageManager";
import Card from "../components/gameobjects/card-component/card";
import MyHtmlElement from "../components/htmlElement";

export default class CardFactory {
    constructor(game) {
        this.game = game;
    }

    createOreCard(amount) {
        return this.doCreate(amount, cardTypes.ore, "card-ore");
    }

    createWoolCard(amount) {
        return this.doCreate(amount, cardTypes.wool, "card-wool");
    }

    createStoneCard(amount) {
        return this.doCreate(amount, cardTypes.stone, "card-stone");
    }

    createWoodCard(amount) {
        return this.doCreate(amount, cardTypes.wood, "card-wood");
    }

    createCornCard(amount) {
        return this.doCreate(amount, cardTypes.corn, "card-corn");
    }


    doCreate(amount, type, imgName) {
        let gameObjects = [];
        for (var i = 0; i < amount; i++) {
            let gameObject = {
                type: new CardType(type),
                imgSource: getImageByName(imgName),
                backside: new MyHtmlElement({
                    div: document.createElement("img"),
                    id: "card-back",
                    draggable: true,
                    src: getImageByName("card-back")
                })
            }
            gameObjects.push(new Card(this.game, gameObject));
        }
        return gameObjects;
    }
}