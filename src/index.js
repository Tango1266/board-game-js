import { assemble } from "./assembling/assembler";
import './**/*.css';
import { TouchScroll } from "./utils/TouchScroll";

let playerData = [{ name: "Daniele" }, { name: "Daniel" }, { name: "Iryna" }, { name: "Nina" }];
let assembled = assemble(playerData);
assembled.game.init();
assembled.resourceArea.init();

let scrolables = document.querySelectorAll(".dragscroll");

scrolables.forEach((el) => {
    let newScrolable = new TouchScroll();
    console.log(el.id)
    newScrolable.init({
        id: el.id,
        draggable: true,
        wait: false,
        ignoreDraggableElements: true,
    });
})

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