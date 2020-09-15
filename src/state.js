let buildingState;

export default class State {
    constructor() {}

    get buildingSlots() {
        if (!buildingState)
            buildingState = this.createBuildingState();
        return buildingState;
    }

    addBuilding(buildingSlot, building) {
        const boardRow = buildingSlot.position.boardRow;
        const boardCol = buildingSlot.position.boardCol;
        this.buildingSlots[boardRow][boardCol] = building.id;
        return this;
    }

    removeBuilding(building) {
        this.buildingSlots[building.position.boardRow][building.position.boardCol] = null;
        return this;
    }

    createBuildingState() {
        let state = new Array(23);
        for (var i = 0; i < state.length; i++) {
            state[i] = new Array(23);
        }
        return state;
    }
}