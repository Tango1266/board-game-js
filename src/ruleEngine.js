import { TYPES } from "./building";

export default class BuildingRules {

    constructor(game, slot, building) {
        this.game = game;
        this.slot = slot;
        this.building = building;
        this.building.buildingT
    }

    onlyOneBuildingPerSlot() {
        if(this.building.type.name === TYPES.town.name
            && !this.slot.isEmpty()
            &&  this.slot.currBuilding.type.name !== TYPES.town.name) {
            return true;
        }
        return this.slot.isEmpty();
    }

    onlyBuildingsAtCornors() {
        if (this.slot.type === "street" || this.building.type.category === this.slot.type 
            && this.slot.type === "building") {
            return true;
        }

        console.log("onlyBuildingsAtCornors");
        return false;
    }

    onlyStreetsWithBuildings() {
        if (this.slot.type !== "street") {
            return true;
        }
        let stateY = this.slot.mods.row;
        let stateX = this.slot.mods.col;
        let state = this.game.buildingState;
        let neigbours = [
            // direct neighbours - are always building or nothing because of #onlyBuildingsAtCornors
            { y: -1, x: 0 },
            { y: 1, x: 0 },
            { y: -1, x: 1 },
            { y: -1, x: -1 },
            { y: 1, x: -1 },
            { y: 1, x: 1 },

            // second degree neigbours - are always streets
            { y: -2, x: 1 },
            { y: -2, x: -1 },
            { y: 2, x: 1 },
            { y: 2, x: -1 },
            { y: 0, x: -2 },
            { y: 0, x: 2 },
        ]
        
        for(var n of neigbours){
            if (n.y + stateY < 0 || n.y + stateY >= state.length ) {
                continue;
            }

            if (n.x + stateX < 0 || n.x + stateX >= state[stateY].length) {
                continue;
            }

            if (state[n.y + stateY][n.x + stateX ] > 0) {
                return true;
            }
        }
        console.log("onlyStreetsWithBuildings");
        return false;
    }

    twoStreetsBetweenBuildings(ignoreBuildingOnStreet) {
        if (this.slot.type !== "building") {
            return true;
        }
        let stateY = this.slot.mods.row;
        let stateX = this.slot.mods.col;
        let state = this.game.buildingState;
        let hasBuildingDirectNeighbour = false; 
        let hasStreetDirectNeigbour = false;
        
        let streetSlotNeighbours = [
            // direct neighbours - are always building or nothing because of #onlyBuildingsAtCornors
            { y: -1, x: 0 },
            { y: 1, x: 0 },
            { y: -1, x: 1 },
            { y: -1, x: -1 },
            { y: 1, x: -1 },
            { y: 1, x: 1 },
        ]
        let buildingSlotNeighbours = [
            // second degree neigbours - are always streets
            { y: -2, x: 0 }, // to-top
            { y: 2, x: 0 }, // to-bottom
            { y: 2, x: 2 }, // right-lower 
            { y: 2, x: -2 }, // left-lower 
            { y: -2, x: 2 }, // right-upper 
            { y: -2, x: -2 }, // left-upper 
        
        ]

        for (var n of buildingSlotNeighbours) {
            if (n.y + stateY < 0 || n.y + stateY >= state.length) {
                continue;
            }

            if (n.x + stateX < 0 || n.x + stateX >= state[stateY].length) {
                continue;
            }

            if (state[n.y + stateY][n.x + stateX] > 0) {
                hasBuildingDirectNeighbour = true;
                break;
            }
        }
        
        if (ignoreBuildingOnStreet) {
            return !hasBuildingDirectNeighbour;
        }

        for (var n of streetSlotNeighbours) {
            if (n.y + stateY < 0 || n.y + stateY >= state.length) {
                continue;
            }

            if (n.x + stateX < 0 || n.x + stateX >= state[stateY].length) {
                continue;
            }

            if (state[n.y + stateY][n.x + stateX] > 0) {
                // has direct street neighbour
                hasStreetDirectNeigbour = true ;
                break;
            }
        }
        console.log("twoStreetsBetweenBuildings");
        return !hasBuildingDirectNeighbour && hasStreetDirectNeigbour;
    }

    citiesBuildOnlyOnTowns() {
        if (this.building.type.name !== TYPES.town.name) {
            return true;
        }

        if (this.slot.type === "building" 
            && this.building.type.category === this.slot.type
            && this.game.buildingState[this.slot.mods.row][this.slot.mods.col] >= 1) {
            return true;
        }
        console.log("citiesBuildOnlyOnTowns");
        return false;
    }

    allowed() {
        let ignoreBuildingOnStreet = this.game.currentPhase === this.game.GAME_PHASES.POPULATE;
        
        return this.onlyOneBuildingPerSlot() && this.onlyBuildingsAtCornors()
            && this.onlyStreetsWithBuildings() && this.twoStreetsBetweenBuildings(ignoreBuildingOnStreet) && this.citiesBuildOnlyOnTowns();
    }

    // rule - buildings are only placeable at a corner


}