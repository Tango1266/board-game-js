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

//let overflownElements = MyHtmlElement.getAll().filter((el) => el.isOverflown);
//console.log("Overflown elements: ", overflownElements);

// let div = MyHtmlElement.getElementById('player4-street83');
// for(var ev in div.div) {
//     console.log(ev, div.div[ev])
// }

// let div = MyHtmlElement.getElementById('table');

// let div2 = MyHtmlElement.getElementById('player2-street33');
// let div3 = MyHtmlElement.getElementById('building_slot82');
// let div4 = MyHtmlElement.getElementById('street_slot5');

// console.log(div.events.name)
// console.log(div2.events.name)
// console.log(div3.events.name)
// console.log(div4.events.name)