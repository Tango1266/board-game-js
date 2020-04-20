import Game from "./game";
import Player from "./player";
import MyHtmlElement from "./htmlElement";
import Board from "./board";


let players = [new Player()];

let game = new Game(players);

let select = document.getElementsByName("change-state")[0];

for (let phase in game.GAME_PHASES) {
    var option = document.createElement("option");
    option.text = phase;
    option.id = game.GAME_PHASES[phase];
    select.add(option);
}

game.init();
game.draw();

select.options[game.currentPhase].selected = true;
select.onchange = function(e){
    console.log(e.target.value);
    this.currentPhase = this.GAME_PHASES[e.target.value];
}.bind(game);


window.onscroll = function () {
    var header = document.getElementById("header");
    var sticky = header.offsetTop;

    if(window.pageYOffset +1 > sticky) {
        header.classList.add("sticky");
    }
    else {
        header.classList.remove("sticky");
    }
}


var resdivs = document.getElementById("resource-area");
let allocateRes = document.getElementById("allocate-resource");

allocateRes.onclick = () => {
    game.resourceArea.allocateResources(resdivs.children);
};

let shufle = document.getElementById("shufle-resources");
shufle.onclick = () => {
    game.resourceArea.shufleDiv(resdivs);

};