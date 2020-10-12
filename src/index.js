import { assemble } from "./assembling/assembler";
import './**/*.css';
import { TouchScroll } from "./utils/TouchScroll";
import Popup from "./windows/popup/popup";

// let playerData = [{ name: "Daniele" }, { name: "Daniel" }, { name: "Iryna" }, { name: "Nina" }];
let playerData = [{ name: "Daniele" }, { name: "Daniel" }, { name: "Iryna" }];
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

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if(!isFirefox) {
    let popup = new Popup();
    popup.alert("Diese frühe Version ist für 'Mozilla Firefox' optimiert. Dein Browser könnte daher Darstellungsprobleme haben.")    
}
// assembled.game.startPhase(-1);

