import Building from "./building";


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
            type: "village",
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
            type: "street",
            imgSource: "/street.f81d0e7a.png",
            ownerArea: game.getElementsByClassName("player-area-" + player.id)[0]
        })
    }

}