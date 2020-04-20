import BuildingSlot from "./buildingSlot";
import ResourceSlot from "./resourceSlot";
import { slotTypes, SlotType } from "./types";
import MyHtmlElement from "./htmlElement";


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

export default class Board extends MyHtmlElement {

    constructor(game) {
        super({
            div: document.getElementById("board")
        })
        this.game = game;
        this.buildingSlots = [];
        this.resourceSlots = [];
    }

    init() {
        this.makeRessourceSlots();
        this.makeBuildingSlots();
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
                    boardRow: row,
                    boadCol: col
                };
                this.resourceSlots.push(
                    new ResourceSlot(this.game, this, position)
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
        let isStreetLeftUpper = true;

        for (var row = 0; row < boardBuildSlotTemplate.length; row++) {
            for (var col = 0; col < boardBuildSlotTemplate[row].length; col++) {
                // adjust pos each fourth row in relation to row
                let posX = 0;
                let posY = 0;
                let slotType = null;
                if (count == 4) {
                    count = 0;
                    adjustYPosBuilding = adjustingFactor * row / 3;
                }

                if (boardBuildSlotTemplate[row][col] == 0) {
                    slotType = new SlotType(slotTypes.building.name);
                    posX = (col * resourceWidth / 4 - 25);
                    posY = (adjustYPosBuilding + row * (height / 8));
                }

                if (boardBuildSlotTemplate[row][col] == 2) {
                    slotType = new SlotType(slotTypes.street.name);
                    let adjustYPosStreet = (adjustingFactor * (row - 1) / 3);
                    posX = (col * resourceWidth / 4 - 25);
                    posY = (adjustYPosStreet + row * (height / 8));
                }

                if (!slotType) {
                    continue;
                }

                let position = {
                    x: Math.round(posX),
                    y: Math.round(posY),
                    boardRow: row,
                    boardCol: col
                };
                if (row % 4 == 1 && col != 0 && col % 2 == 0) {
                    if (isStreetLeftUpper) {
                        slotType.isLeftUpper = true;
                    }
                    else {
                        slotType.isRightUpper = true;
                    }
                    // every second even col is right
                    isStreetLeftUpper = !isStreetLeftUpper;
                }

                this.buildingSlots.push(new BuildingSlot(this.game, this, position, slotType, { row: row, col: col }))
            }

            // first street is always left upper
            isStreetLeftUpper = true;
            count++;
        };
    }

    draw() {
        this.resourceSlots.forEach((res) => res.draw());
        this.buildingSlots.forEach((bs) => bs.draw());
    }
}