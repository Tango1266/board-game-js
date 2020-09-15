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
    newScrolable.init({
        id: el.id,
        draggable: true,
        wait: false,
        ignoreDraggableElements: true,
    });
})

assembled.game.startGame();
// assembled.game.startPhase(-1);
