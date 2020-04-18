import Building, { TYPES } from "./building";
import { buildingTypes, BuildingType } from "./types";


export default class BuildingFactory {
    constructor() {

    }

    createVillages(game, player, amount) {
        let gameObjects = [];
        for (var i = 0; i < amount; i++) {
            let gameObject = {
                player: player.id,
                color: "sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
                type: new BuildingType(buildingTypes.village),
                imgSource: "/village.cce71a77.png",
                ownerArea: game.div.getElementsByClassName("player-area-" + player.id)[0]
            }
            gameObjects.push(new Building(game, gameObject));
        }
        return gameObjects;
    }

    createStreets(game, player, amount) {
        let streets = [];
        for (var i = 0; i < amount; i++) {
            let street = {
                player: player.id,
                color: "sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
                type: new BuildingType(buildingTypes.street),
                imgSource: "/street.f81d0e7a.png",
                ownerArea: game.div.getElementsByClassName("player-area-" + player.id)[0]
            }
            streets.push(new Building(game, street));
        }
        return streets;
    }

    createTowns(game, player, amount) {
        let towns = [];
        for (var i = 0; i < amount; i++) {
            let town = {
                player: player.id,
                color: "sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
                type: new BuildingType(buildingTypes.town),
                imgSource: "/town.ef60d94a.png",
                ownerArea: game.div.getElementsByClassName("player-area-" + player.id)[0]
            }
            towns.push(new Building(game, town));
        }
        return towns;
    }
}