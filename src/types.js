export const slotTypes = {
    "building": { name: "town"},
    "street": { name: "street"},
}
export const buildingTypes = {
    "town": { name: "town", slotType: slotTypes.building},
    "street": { name: "street", slotType: slotTypes.building },
    "village": { name: "village", slotType: slotTypes.building }
}

