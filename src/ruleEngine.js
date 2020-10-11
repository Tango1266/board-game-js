import { buildingTypes, slotTypes, BuildingType } from "./types";
import MyHtmlElement from "./components/htmlElement";

const directNeighbours = [
    { y: -1, x: 0 },
    { y: 1, x: 0 },
    { y: -1, x: 1 },
    { y: -1, x: -1 },
    { y: 1, x: -1 },
    { y: 1, x: 1 },
]

const streetNeighbours = [
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
        } else {
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

        if (this.logResult) this.lastResult = "onlyBuildingsAtCornors";
        return false;
    }

    allBuildingHaveStreets() {
        if (!this.slot.type.isEqual(slotTypes.building))
            return true;

        const playedBuildings = this.building.owner.gameObjects[this.building.type.name].filter(b => b.isPlayed());

        if (playedBuildings.length <= 0)
            return true

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

        if (this.logResult) this.lastResult = "onlyBuildingsAtCornors";

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
        ]

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
            { y: -2, x: 0 }, // to-top
            { y: 2, x: 0 }, // to-bottom
            { y: 2, x: 2 }, // right-lower 
            { y: 2, x: -2 }, // left-lower 
            { y: -2, x: 2 }, // right-upper 
            { y: -2, x: -2 }, // left-upper 
        ]

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

        if (this.logResult) this.lastResult = "citiesBuildOnlyOnTowns";

        return false;
    }
}


export class ResourceSlotRules {
    constructor(game, slot, resource, logResult) {
        this.game = game;
        this.slot = slot;
        this.resource = resource;

        this.logResult = logResult || true;
        this.lastResult = "";
    }

    allowed() {
        const currentPhase = this.game.currentPhase;
        const phase = this.game.GAME_PHASES;

        if (currentPhase != phase.PREPARE) return false;

        return this.onlyEmpty() && this.firstOnlyAtCorners() && this.onlyCounterClockWise()

    }

    onlyEmpty() {
        return this.slot.isEmpty();
    }

    firstOnlyAtCorners() {
        //determin if it is first: 
        // first, if number of childs of resArea equals number of slots
        let isFirst = this.game.board.resourceSlots.length == this.resource.parent.getChildren().length;

        if (isFirst) return this.slot.isCorner();

        return true;
    }

    onlyCounterClockWise() {
        let countPlayedRes = this.game.board.resources.length;

        if (countPlayedRes < 1) return true;

        let lastPlayedRes = this.game.board.resources[countPlayedRes - 1];

        const template = this.game.board.resourceSlotTemplate;
        const row = lastPlayedRes.parent.position.boardRow;
        const col = lastPlayedRes.parent.position.boadCol;
        // console.log("current", row, col)

        function getSlot(row, col) {
            // console.log("next", row, col)

            if (col > template[row] - 1 || row > template.length - 1) return null;
            let rows = template.slice(0, row + 1);
            let maxSlots = rows.length > 0 ? rows.reduce((acc, cur) => acc + cur) : template[row];
            let id = maxSlots - (template[row] - col);
            // console.log("countSlots: ", maxSlots, "maxRow: ", template[row], "row: ", row, "col: ", col, "id: ", id)
            return MyHtmlElement.getElementById("hexagon_" + id)
        }
        const directions = {
            upRight: { col: 1, row: -1 },
            up: { col: 0, row: -1 },
            upLeft: { col: -1, row: -1 },
            left: { col: -1, row: 0 },
            downLeft: { col: -1, row: 1 },
            down: { col: 0, row: 1 },
            downRight: { col: 1, row: 1 },
            right: { col: 1, row: 0 },
        }

        function doFindNextSlot(row, col, directions) {
            for (var nextDir of directions) {
                const nextRow = row + nextDir.row;
                let nextCol = col + nextDir.col;
                // console.log("nextCol", nextCol)
                let slot = getSlot(nextRow, nextCol);
                if (slot != null && slot.isEmpty()) return slot;
            }
        }

        function findNextSlot() {
            // when last col => Go up /right, left
            const isLastCol = col == template[row] - 1;
            if (isLastCol) {
                // console.log("isLastCol:")
                return doFindNextSlot(row, col, [directions.upRight, directions.up, directions.upLeft, directions.left])
            }

            const isFirstCol = col == 0;
            if (isFirstCol) {
                // console.log("isFirstCol:")
                return doFindNextSlot(row, col, [directions.down, directions.downRight, directions.right])
            }

            const isFirstRow = row == 0;
            if (isFirstRow) {
                // console.log("isFirstRow:")
                return doFindNextSlot(row, col, [directions.left, directions.down])
            }

            const isLastRow = row == template.length - 1;
            if (isLastRow) {
                // console.log("isLastRow:")
                return doFindNextSlot(row, col, [directions.right, directions.upRight, directions.upLeft])
            }

            let isUpperBoard = row < Math.floor(template.length / 2);
            let isMidBoard = row == Math.floor(template.length / 2);
            let isLeftSide = col < Math.floor(template[row] / 2);

            // console.log("isUpperBoard && isLeftSide")
            if (isUpperBoard && isLeftSide)
                return doFindNextSlot(row, col, [directions.down, directions.downRight])

            // console.log("isUpperBoard")
            if (isUpperBoard)
                return doFindNextSlot(row, col, [directions.left, directions.down])

            // console.log("!isMidBoard")
            if (!isMidBoard)
                return doFindNextSlot(row, col, [directions.right, directions.upRight, directions.up, directions.upLeft])

            // console.log("isLeftSide")
            if (isLeftSide)
                return doFindNextSlot(row, col, [directions.down, directions.downRight, directions.right])

            // console.log("last")
            return doFindNextSlot(row, col, [directions.upLeft, directions.left])
        }

        const next = findNextSlot();
        if (!next) return false;

        return this.slot.id === next.id;
    }
}