import { buildingTypes, slotTypes, BuildingType } from "../types";
import MyHtmlElement from "../components/htmlElement";

export const directNeighbours = [
    { y: -1, x: 0 },
    { y: 1, x: 0 },
    { y: -1, x: 1 },
    { y: -1, x: -1 },
    { y: 1, x: -1 },
    { y: 1, x: 1 },
]

export const streetNeighbours = [
    { y: -2, x: 1 },
    { y: -2, x: -1 },
    { y: 2, x: 1 },
    { y: 2, x: -1 },
    { y: 0, x: -2 },
    { y: 0, x: 2 },
]

export default class BuildingRules {

    constructor(game, slot, building, logResult) {
        this.game = game;
        this.slot = slot;
        this.building = building;

        this.logResult = logResult || true;
        this.lastResult = "";
    }

    allowed() {
        const currentPhase = this.game.currentPhase;
        const phase = this.game.GAME_PHASES;

        switch (currentPhase) {
            case phase.NOTINITALISED:
                return true;
            case phase.POPULATE:
                return this.onlyOneBuildingPerSlot() && this.onlyBuildingsAtCornors() && this.allBuildingHaveStreets() && this.allStreetsHaveBuildings() &&
                    this.onlyStreetsWithBuildings() && this.twoStreetsBetweenBuildings(true) && this.citiesBuildOnlyOnTowns();

            case phase.START:
                return this.onlyOneBuildingPerSlot() && this.onlyBuildingsAtCornors() &&
                    this.onlyStreetsWithBuildings() && this.twoStreetsBetweenBuildings(false) && this.citiesBuildOnlyOnTowns();
            default:
                break;
        }

        return false;
    }

    getNeighbours(neighbourCoordinates) {
        const state = this.game.buildingState;
        const stateY = this.slot.position.boardRow;
        const stateX = this.slot.position.boardCol;
        const neighbours = [];
        const neighbourCoords = neighbourCoordinates || directNeighbours;
        for (var n of neighbourCoords) {
            if (n.y + stateY < 0 || n.y + stateY >= state.length)
                continue;

            if (n.x + stateX < 0 || n.x + stateX >= state[stateY].length)
                continue;

            //check if player owns neighbour 
            const neighbourBuilding = MyHtmlElement.getElementById(state[n.y + stateY][n.x + stateX]);
            if (neighbourBuilding != null && neighbourBuilding.owner.id == this.building.owner.id) {
                neighbours.push(neighbourBuilding);
            }
        }

        return neighbours;
    }

    hasNeighbours(buildingOrSlot, neighbourCoordinates, ignoreOwnership, typeToCheck) {
        ignoreOwnership = ignoreOwnership || false;
        const state = this.game.buildingState;
        let stateY, stateX = -1;
        if (buildingOrSlot.type instanceof BuildingType) {
            stateY = buildingOrSlot.buildingSlot.position.boardRow;
            stateX = buildingOrSlot.buildingSlot.position.boardCol;
        }
        else {
            stateY = buildingOrSlot.position.boardRow;
            stateX = buildingOrSlot.position.boardCol;
        }

        const neighbourCoords = neighbourCoordinates || directNeighbours;
        for (var n of neighbourCoords) {
            if (n.y + stateY < 0 || n.y + stateY >= state.length)
                continue;

            if (n.x + stateX < 0 || n.x + stateX >= state[stateY].length)
                continue;

            const neighbourBuilding = MyHtmlElement.getElementById(state[n.y + stateY][n.x + stateX]);
            if (neighbourBuilding != null) {
                //check if player owns neighbour 
                if (ignoreOwnership || neighbourBuilding.owner.id == this.building.owner.id)
                    return true;
            }
        }

        return false;

    }

    onlyOneBuildingPerSlot() {
        if (this.building.type.isEqual(buildingTypes.town) &&
            !this.slot.isEmpty &&
            !this.slot.getChild().type.isEqual(buildingTypes.town)) {
            return true;
        }

        if (this.logResult)
            this.lastResult = "onlyStreetsWithBuildings";

        return this.slot.isEmpty;
    }

    onlyBuildingsAtCornors() {
        if (this.slot.type.isEqual(slotTypes.street) || this.building.type.slotType.isEqual(this.slot.type) &&
            this.slot.type.isEqual(slotTypes.building)) {
            return true;
        }

        if (this.logResult)
            this.lastResult = "onlyBuildingsAtCornors";
        return false;
    }

    allBuildingHaveStreets() {
        if (!this.slot.type.isEqual(slotTypes.building))
            return true;

        const playedBuildings = this.building.owner.gameObjects[this.building.type.name].filter(b => b.isPlayed());

        if (playedBuildings.length <= 0)
            return true;

        let allBuildingHaveStreets = true;
        for (var building of playedBuildings) {
            let buildingHasStreet = this.hasNeighbours(building);
            allBuildingHaveStreets = allBuildingHaveStreets && buildingHasStreet;
        }

        if (!allBuildingHaveStreets && this.logResult)
            this.lastResult = "onlyBuildingsWithStreets";

        return allBuildingHaveStreets;
    }

    allStreetsHaveBuildings() {
        if (!this.slot.type.isEqual(slotTypes.street))
            return true;

        let neighbourVillages = this.getNeighbours();
        let neighbourStreets = this.getNeighbours(streetNeighbours);

        // can only build street on a village without a street 
        if (neighbourVillages.length >= 1 && neighbourStreets.length < 1)
            return true;

        if (this.logResult)
            this.lastResult = "onlyBuildingsAtCornors";

        return false;
    }

    onlyStreetsWithBuildings() {
        if (!this.slot.type.isEqual(slotTypes.street)) {
            return true;
        }

        const neighbourCoordinates = [
            // direct neighbours are always building or nothing because of #onlyBuildingsAtCornors
            ...directNeighbours,
            // second degree neigbours for streets- are always streets
            ...streetNeighbours
        ];

        if (this.hasNeighbours(this.slot, neighbourCoordinates))
            return true;

        if (this.logResult)
            this.lastResult = "onlyStreetsWithBuildings";

        return false;
    }

    twoStreetsBetweenBuildings(ignoreBuildingOnStreet) {
        if (!this.slot.type.isEqual(slotTypes.building)) {
            return true;
        }

        let hasBuildingNeighbour = false;
        let hasStreetDirectNeigbour = false;

        let buildingNeighbours = [
            // second degree neigbours - are always villages/towns for a village/town
            { y: -2, x: 0 },
            { y: 2, x: 0 },
            { y: 2, x: 2 },
            { y: 2, x: -2 },
            { y: -2, x: 2 },
            { y: -2, x: -2 },
        ];

        hasBuildingNeighbour = this.hasNeighbours(this.slot, buildingNeighbours, true);
        if (ignoreBuildingOnStreet) {
            return !hasBuildingNeighbour;
        }

        hasStreetDirectNeigbour = this.hasNeighbours(this.slot);

        if (this.logResult)
            this.lastResult = "twoStreetsBetweenBuildings";

        return !hasBuildingNeighbour && hasStreetDirectNeigbour;
    }

    citiesBuildOnlyOnTowns() {
        if (!this.building.type.isEqual(buildingTypes.town))
            return true;

        if (this.building.type.slotType.isEqual(this.slot.type) &&
            this.game.buildingState[this.slot.position.boardRow][this.slot.position.boardCol] != null) {
            return true;
        }

        if (this.logResult)
            this.lastResult = "citiesBuildOnlyOnTowns";

        return false;
    }
}
