import Building, { TYPES } from "./building";


export default class BuildingFactory {
    constructor() {

    }

    createVillages(game, player, amount) {
        let villages = [];

        for(var i = 0; i < amount; i++) {
            villages.push(this.createVillage(game.div, player));
        }
        
        return villages;
    }

    createVillage(game, player) {
        return new Building(game, {
            player: player.id,
            color: "sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
            type: TYPES.village,
            imgSource: "/village.cce71a77.png",
            ownerArea: game.getElementsByClassName("player-area-" + player.id)[0]
        })
    }

    createStreets(game, player, amount) {
        let streets = [];
        for (var i = 0; i < amount; i++) {
            streets.push(this.createStreet(game.div, player));
        }
        return streets;
    }

    createStreet(game, player) {
        return new Building(game, {
            player: player.id,
            color: "sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
            type: TYPES.street,
            imgSource: "/street.f81d0e7a.png",
            ownerArea: game.getElementsByClassName("player-area-" + player.id)[0]
        })
    }

    createTowns(game, player, amount) {
        let streets = [];
        for (var i = 0; i < amount; i++) {
            streets.push(this.createTown(game.div, player));
        }
        return streets;
    }

    createTown(game, player) {
        return new Building(game, {
            player: player.id,
            color: "sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
            type: TYPES.town,
            imgSource: "/town.ef60d94a.png",
            ownerArea: game.getElementsByClassName("player-area-" + player.id)[0]
        })
    }
}