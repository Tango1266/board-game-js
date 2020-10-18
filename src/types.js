export const slotTypes = {
    "building": { name: "building" },
    "street": { name: "street" },
    "resource": { name: "resource" },
    "resourceNumber": { name: "resource-number" },
    "resourceCard": { name: "resource-card" },
    "evolutionCard": { name: "evolution-card" },
}

export const buildingTypes = {
    "town": { name: "town", slotType: slotTypes.building },
    "village": { name: "village", slotType: slotTypes.building },
    "street": { name: "street", slotType: slotTypes.street },
}

export let resourceTypes = {
    "wool": { name: "wool", slotType: slotTypes.resource },
    "ore": { name: "ore", slotType: slotTypes.resource },
    "stone": { name: "stone", slotType: slotTypes.resource },
    "corn": { name: "corn", slotType: slotTypes.resource },
    "wood": { name: "wood", slotType: slotTypes.resource },
    "dessert": { name: "dessert", slotType: slotTypes.resource },
}

export const resourceNumberTypes = {
    "veryrare": { name: "veryrare", slotType: slotTypes.resourceNumber },
    "rare": { name: "virarellage", slotType: slotTypes.resourceNumber },
    "occasional": { name: "occasional", slotType: slotTypes.resourceNumber },
    "frequent": { name: "frequent", slotType: slotTypes.resourceNumber },
    "common": { name: "common", slotType: slotTypes.resourceNumber },
}

export let cardTypes = {
    "wool": { name: "card-wool", slotType: slotTypes.resourceCard },
    "ore": { name: "card-ore", slotType: slotTypes.resourceCard },
    "stone": { name: "card-stone", slotType: slotTypes.resourceCard },
    "corn": { name: "card-corn", slotType: slotTypes.resourceCard },
    "wood": { name: "card-wood", slotType: slotTypes.resourceCard },
    "winPoint": { name: "win-point", slotType: slotTypes.evolutionCard }, //5
    "knight": { name: "knight", slotType: slotTypes.evolutionCard }, //14
    "freeResources": { name: "free-resources", slotType: slotTypes.evolutionCard }, //2
    "freeStreets": { name: "free-streets", slotType: slotTypes.evolutionCard }, //2
    "monopoly": { name: "monopoly", slotType: slotTypes.evolutionCard }, //2
}

export class TypeObject {
    constructor(type, args) {
        if ("string" === typeof(type))
            this.name = type;
        else if ("object" === typeof(type))
            this.name = type.name;

        if (args) {
            for (var arg in args) {
                this[arg] = args[arg];
            }
        }
        if (type.slotType) {
            this.slotType = new SlotType(type.slotType.name);
        }
        this.category = this.constructor.name;
    }

    isEqual(object) {
        return object ? this.name === object.name : false;
    }
}

export class SlotType extends TypeObject {
    constructor(type, args) {
        super(type, args)
    }
}

export class ResourceSlotType extends SlotType {
    constructor(type, args) {
        super(type, args);

        this.diceNum = args ? args["diceNum"] : null;
        this.isCorner = args && args.isCorner ? args.isCorner : false;
    }
}

export class BuildingType extends TypeObject {
    constructor(type, args) {
        super(type, args);
    }

    isEqual(object) {
        return object ? this.name === object.name && this.slotType.isEqual(object.slotType) : false;
    }
}

export class ResourceType extends TypeObject {
    constructor(type, args) {
        super(type, args);
    }
}

export class CardType extends TypeObject {
    constructor(type, args) {
        super(type, args);
    }
}