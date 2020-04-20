export const slotTypes = {
    "building": { name: "building" },
    "street": { name: "street" },
    "resource": { name: "resource" },
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

export class TypeObject {
    constructor(name, args) {
        this.name = name;
        if (args) {
            for (var arg in args) {
                this[arg] = args[arg];
            }
        }
    }

    isEqual(object) {
        return object ? this.name === object.name : false;
    }
}

export class SlotType extends TypeObject {
    constructor(name, args) {
        super(name, args)
    }
}

export class BuildingType extends TypeObject {
    constructor(type, args) {
        super(type.name, args);
        this.slotType = new SlotType(type.slotType.name);
    }

    isEqual(object) {
        return object ? this.name === object.name && this.slotType.isEqual(object.slotType) : false;
    }
}

export class ResourceType extends TypeObject {
    constructor(type, args) {
        super(type.name, args);
        this.slotType = new SlotType(type.slotType.name);
    }
}

