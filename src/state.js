
let buildingState;

export default class State {
    constructor(){
    }

    get buildingSlots() {
        if (!buildingState)
            buildingState = this.createBuildingState();
        return buildingState;
    }

    addBuilding(building) {
        this.buildingSlots[building.position.boardRow][building.position.boardCol] = 1;
        return this;
    }

    removeBuilding(building) {
        this.buildingSlots[building.position.boardRow][building.position.boardCol] = -1;
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