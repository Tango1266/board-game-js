import { assemble } from "./assembling/assembler";

import './**/*.css';

let playerData = [{ name: "Daniele" }, { name: "Daniel" }, { name: "Iryna" }, { name: "Nina" }];
let assembled = assemble(playerData);
assembled.game.init();
assembled.resourceArea.init();

// let body = document.getElementById("table");
// console.log(body)
// body.onmousemove = onMouseMove;
// body.onmousedown = onMouseDown;
// body.onmouseup = onMouseUp;

// function onMouseMove(e) {
//     e.preventDefault();
// }

// function onMouseDown(e) {
//     e.preventDefault();
// }

// function onMouseUp(e) {
//     e.preventDefault();
// }