import { resourceTypes, ResourceType } from "./types";
import Resource from "./resource";

export default class ResourceFactory {
    constructor() {

    }

    createOre(game, amount) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let resource = {
                type: new ResourceType(resourceTypes.ore),
                imgSource: "ore.7a0b032f.png",
            }
            resources.push(new Resource(game, resource));
        }
        return resources;
    }

    createStone(game, amount) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let resource = {
                type: new ResourceType(resourceTypes.stone),
                imgSource: "stone.c6e75a2b.png",
            }
            resources.push(new Resource(game, resource));
        }
        return resources;
    }

    createWool(game, amount) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let resource = {
                type: new ResourceType(resourceTypes.wool),
                imgSource: "wool.2d2f7543.png",
            }
            resources.push(new Resource(game, resource));
        }
        return resources;
    }

    createCorn(game, amount) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let resource = {
                type: new ResourceType(resourceTypes.corn),
                imgSource: "corn.8833e0d8.png",
            }
            resources.push(new Resource(game, resource));
        }
        return resources;
    }

    createWood(game, amount) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let resource = {
                type: new ResourceType(resourceTypes.wood),
                imgSource: "wood.b4717aa6.png",
            }
            resources.push(new Resource(game, resource));
        }
        return resources;
    }

    createDessert(game, amount) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let resource = {
                type: new ResourceType(resourceTypes.dessert),
                imgSource: "dessert.7a507c76.png",
            }
            resources.push(new Resource(game, resource));
        }
        return resources;
    }
}