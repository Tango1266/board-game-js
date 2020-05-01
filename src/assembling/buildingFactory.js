import Building from "../components/gameobjects/building-component/building";
import { buildingTypes, BuildingType } from "../types";
import getImageByName from "../imageManager";

export default class BuildingFactory {
    constructor() {
    }

    createVillages(player, amount) {
        return this.doCreate(player, amount, buildingTypes.village, "village");
    }

    createStreets(player, amount) {
        return this.doCreate(player, amount, buildingTypes.street, "street");
    }

    createTowns(player, amount) {
        return this.doCreate(player, amount, buildingTypes.town, "town");
    }

    doCreate(player, amount, type, imgName) {
        let gameObjects = [];
        for (var i = 0; i < amount; i++) {
            let gameObject = {
                owner: player,
                color: this.getPlayerColor(player),
                type: new BuildingType(type),
                imgSource: getImageByName(imgName),
            }
            gameObjects.push(new Building(player.game, gameObject));
        }
        return gameObjects;
    }

    getPlayerColor(player) {
        let color = ((player) => {
            switch (player.id) {
                // case 1: return "sepia(13%) saturate(3207%) hue-rotate(50deg) brightness(95%) contrast(80%)";
                // case 2: return "sepia(13%) saturate(3207%) hue-rotate(150deg) brightness(95%) contrast(800%)";
                // case 3: return "sepia(13%) saturate(3207%) hue-rotate(200deg) brightness(95%) contrast(80%)";
                // case 4: return "sepia(13%) saturate(3207%) hue-rotate(250deg) brightness(95%) contrast(80%)";
                case 1: return "hue-rotate(0deg) contrast(200%)";
                case 2: return "hue-rotate(100deg)";
                case 3: return "hue-rotate(150deg)";
                case 4: return "hue-rotate(200deg)";
            }
        }
        )(player)
        return color;
    }
}

