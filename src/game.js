
import Board from "./board";
import BuildingFactory from "./buildingFactory";
import ResourceFactory from "./resourceFactory";

const GAME_PHASES = {
    NOTINITALISED: 0,
    POPULATE: 1,
    START: 2
}

export default class Game {
    constructor(players) {
        this.div = document.getElementById("game");
        this.board = new Board(this);
        this.players = players;
        this.buildingState = [[]];

        this.GAME_PHASES = GAME_PHASES;
        this.currentPhase = GAME_PHASES.NOTINITALISED;
        this.resources = null;
    }

    createBuildingState() {
        let state = new Array(23);
        for(var i=0; i < state.length; i++) {
            state[i] = new Array(23);
        }
        return state;
    }

    init() {
        this.buildingState = this.createBuildingState()
        this.board.init();
        this.initPlayerArea();
        this.initResourceArea();
        this.currentPhase = GAME_PHASES.POPULATE;
    }

    initPlayerArea() {
        let bf = new BuildingFactory();
        let allGameObjects = {};
        this.players.forEach((p) => {
            allGameObjects = {
                towns: bf.createTowns(this, p, 4),
                villages: bf.createVillages(this, p, 5),
                streets: bf.createStreets(this, p, 15),
            }
        } )

        for(var gameObjects in allGameObjects) {
            for (var gameObject of allGameObjects[gameObjects]){
                gameObject.draw();
            }
        }
    }

    initResourceArea() {
        let rf = new ResourceFactory();
        this.resources = {
            ore: rf.createOre(this, 3),
            corn: rf.createCorn(this, 4),
            stone: rf.createStone(this, 3),
            wool: rf.createWool(this, 4),
            wood: rf.createWood(this, 4),
            dessert: rf.createDessert(this, 1),

        };

        for (var resKey in this.resources) {
            for (var resource of this.resources[resKey]) {
                resource.draw();
            }
        }
    }

    draw() {
        this.board.draw();

        // this.board.allocateResources(this.resources);
    }
}