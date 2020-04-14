import BuildingSlot from "./buildingSlot";
import Resource from "./resource";
import Building from "./building";

/**
 * 0: building slot for villages
 * 2: building solot for streets 
 */
let boardBuildSlotTemplate = [
    [-1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 2, -1, 2, -1, 2, -1, 2, , 2, -1, 2, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1],
    [-1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1],
    [-1, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, -1],
    [-1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1],
    [-1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1],
    [-1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1],
    [-1, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1],
    [-1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1],
    [-1, -1, -1, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, 2, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 2, -1, 2, , 2, -1, 2, , 2, -1, 2, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1],
]

export default class Board {

    constructor(game) {
        this.game = game;
        this.div = document.getElementById("board");
        this.buildingSlots = [];
        this.resourceSlots = [];
        // this.gameObjects = [];
        this.offSetBoardLeft = this.div.offsetLeft;
        this.offSetBoardTop = this.div.offsetTop;
    }

    init() {
        this.makeRessourceSlots();
        this.makeBuildingSlots();
        // this.makeGameObjects();
    };

    makeRessourceSlots() {
        let template = [
            3, 4, 5, 4, 3
        ]

        let resourceWidth = 100;
        let resourceHeigt = 100;
        let midRow = Math.round((template.length / 2));
        for (var row = 0; row < template.length; row++) {
            for (var col = 0; col < template[row]; col++) {
                let offsetStart = (resourceWidth * ((template.length - row) % 3));
                if (row >= midRow) {
                    offsetStart = 0;
                }
                let posX =
                    offsetStart // start changes in each row
                    + (col * resourceWidth)// align side by side
                    + (row * resourceWidth / 2) // align betweend two elements relative to previous row
                    - resourceWidth; // if omit then it causes offset 

                let posY = resourceHeigt + row * resourceHeigt * 0.85 - resourceHeigt;
                let position = {
                    x: posX, 
                    y: posY,
                    xOffSet: this.offSetBoardLeft / 2,
                    yOffSet: this.offSetBoardTop / 2
                };
                this.resourceSlots.push(
                    new Resource(this.game.div, this, position)
                )
            }
        }
    }

    makeBuildingSlots() {
        let count = 0;
        let adjustYPosBuilding = 0;
        let resourceWidth = 100;
        let height = 100;

        // cards do not ally proportional, 
        // propobably could have fix it by getting the dimensions and positioning of the hexagon streight
        let adjustingFactor = 25.5;
        let streetMod = "";
        // let skipEverySecondOddRow = 0;
        // let skipEverySecondEvenCol = 0;
        let isStreetLeft = true;

        for (var row = 0; row < boardBuildSlotTemplate.length; row++) {
            for (var col = 0; col < boardBuildSlotTemplate[row].length; col++) {
                // adjust pos each fourth row in relation to row
                let posX = 0;
                let posY = 0;
                let buildingSlotType = "";
                if (count == 4) {
                    count = 0;
                    adjustYPosBuilding = adjustingFactor * row / 3;
                }

                if (boardBuildSlotTemplate[row][col] == 0) {
                    buildingSlotType = "building";
                    posX = (col * resourceWidth / 4 - 25) ;
                    posY = (adjustYPosBuilding + row * (height / 8)) ;
                }

                if (boardBuildSlotTemplate[row][col] == 2) {
                    let adjustYPosStreet = (adjustingFactor * (row - 1) / 3);
                    posX = (col * resourceWidth / 4 - 25) ;
                    posY = (adjustYPosStreet +  row * (height / 8)) ;
                    buildingSlotType = "street";
                }

                if(!buildingSlotType) {
                    continue;
                }

                let position = {
                    x: Math.round(posX),
                    y: Math.round(posY),
                    xOffSet: this.offSetBoardLeft / 2,
                    yOffSet: this.offSetBoardTop / 2
                };
                if (row % 4 == 1 && col != 0 && col % 2 == 0 ) {

                    if(isStreetLeft ) {
                        streetMod = "left-upper";
                    }
                    else if (!isStreetLeft) {
                        streetMod = "right-upper"
                    } 

                    // set or reset
                    isStreetLeft = !isStreetLeft;
                }

                // if (row % 2 != 0 && skipEverySecondOddRow < 2 
                //     && col != 0 && col % 2 == 0 && skipEverySecondEvenCol < 2) {
                    
                //     if(isStreetLeft ) {
                //         streetMod = "left-upper";
                //     }
                //     else if (!isStreetLeft) {
                //         streetMod = "right-upper"
                //     } 
                  
                //     // set or reset
                //     skipEverySecondEvenCol = skipEverySecondEvenCol + 1 < 2 ? skipEverySecondEvenCol + 1: 0;
                //     isStreetLeft = !isStreetLeft;
                // }

                this.buildingSlots.push(new BuildingSlot(this.game, this, position, buildingSlotType, {streetMod: streetMod, row:row, col:col}))
                streetMod="";
            }

            // if (row % 2 != 0) {
            //     skipEverySecondOddRow = skipEverySecondOddRow + 1 < 2 ? skipEverySecondOddRow + 1 : 0;
            // }
            count++;
        };
    }

    // makeGameObjects() {
    //     this.gameObjects.push(new Building(game, { player: 1, type: "village", imgSource: "/street.f81d0e7a.png", 
    //     ownerArea: this.game.getElementsByClassName("player-area-1")[0]}))
    // }

    draw() {
        this.resourceSlots.forEach((res) => res.draw());
        this.buildingSlots.forEach((bs) => bs.draw());
        // this.gameObjects.forEach((go) => go.draw())
    }
} 