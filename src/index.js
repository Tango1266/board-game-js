import { assemble } from "./assembling/assembler";
import './**/*.css';
import { TouchScroll } from "./utils/TouchScroll";
import Popup from "./windows/popup/popup";
import StartForm from "./windows/startForm/startForm";


const startForm = new StartForm();
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
// if(!isFirefox) {
//     new Popup({useConsole: true})
//         .alert("Diese frühe Version ist für 'Mozilla Firefox' optimiert. Dein Browser könnte daher Darstellungsprobleme haben.")
//         .then(() => startForm.show(() => start(startForm)));
// }
// else
    startForm.show(() => start(startForm));

function start(form) {
    const humanPlayer = form.data.filter((obj) => obj.name);

    // let playerData = [{ name: "Daniele" }, { name: "Daniel" }, { name: "Iryna" }];
    const playerData = humanPlayer;
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
}


// assembled.game.startPhase(-1);

