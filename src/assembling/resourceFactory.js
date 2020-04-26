import { resourceTypes, ResourceType } from "../types";
import Resource from "../components/gameobjects/resource-component/resource";
import getImageByName from "../imageManager";


export default class ResourceFactory {
    constructor(game) {
        this.game = game;
    }

    doCreate(amount, type, imgName) {
        let resources = [];
        for (var i = 0; i < amount; i++) {
            let details = {
                type: new ResourceType(type),
                imgSource: getImageByName(imgName),
            };
            resources.push(new Resource(this.game, details));
        }
        return resources;
    }
    
    createOre(amount) {
        return this.doCreate(amount, resourceTypes.ore, "ore");
    }

    createStone(amount) {
        return this.doCreate(amount, resourceTypes.stone, "stone");
    }

    createWool(amount) {
        return this.doCreate(amount, resourceTypes.wool, "wool");
    }

    createCorn(amount) {
        return this.doCreate(amount, resourceTypes.corn, "corn");
    }

    createWood(amount) {
        return this.doCreate(amount, resourceTypes.wood, "wood");
    }

    createDessert(amount) {
        return this.doCreate(amount, resourceTypes.dessert, "dessert");
    }
}