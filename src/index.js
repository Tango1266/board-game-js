import Game from "./game";
import Player from "./player";

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