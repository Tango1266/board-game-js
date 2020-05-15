import { assemble } from "./assembling/assembler";
import './**/*.css';
import { TouchScroll } from "./utils/TouchScroll";
import MyHtmlElement from "./components/htmlElement";

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

let overflownElements = MyHtmlElement.getAll().filter((el) => el.isOverflown);
console.log("Overflown elements: ", overflownElements);