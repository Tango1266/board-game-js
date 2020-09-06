import SlotFactory from "./gameAssembling/slotFactory";
import Board from "./components/board/board";
import Player from "./player";
import Game from "./components/table/game";
import BuildingFactory from "./components/gameobjects/building/buildingFactory";
import ResourceArea from "./resourceArea";
import State from "./state";

function assembleBoard(game) {
    let sf = new SlotFactory(game);
    return new Board(
        { 
            buildingSlots: sf.makeBuildingSlots(),
            resourceSlots: sf.makeRessourceSlots() 
        }
    );
}

function assembleResourceArea(game) {
    let ra = new ResourceArea(game);
    ra.init();
    return ra;
}

function assemblePlayers(game, playerData) {
    let bf = new BuildingFactory(game);
    let players = [];
    for (var player in playerData) {
        let newPlayer = new Player(player.name)
        newPlayer.gameObjects = {
            towns: bf.createTowns(newPlayer, 4),
            villages: bf.createVillages(newPlayer, 5),
            streets: bf.createStreets(newPlayer, 15),
        }

        players.push(newPlayer)
    }

    return players;
}

export function assemble(playerData){
    let game = new Game({ state: new State()}).init();
    game.players = assemblePlayers(game, playerData);
    game.board = assembleBoard(game);

    // select
    let select = document.getElementsByName("change-state")[0];
    for (let phase in game.GAME_PHASES) {
        var option = document.createElement("option");
        option.text = phase;
        option.id = game.GAME_PHASES[phase];
        select.add(option);
    }
    select.onchange = function (e) {
        this.currentPhase = this.GAME_PHASES[e.target.value];
    }.bind(game);
    select.options[game.currentPhase].selected = true;

    // header
    window.onscroll = function () {
        var header = document.getElementById("header");
        var sticky = header.offsetTop;

        if (window.pageYOffset + 1 > sticky) {
            header.classList.add("sticky");
        }
        else {
            header.classList.remove("sticky");
        }
    }


    // let resourceArea = assembleResourceArea(game);
    // // resource area controls
    // var resdivs = document.getElementById("resource-area");
    // let allocateRes = document.getElementById("allocate-resource");

    // allocateRes.onclick = () => {
    //     resourceArea.allocateResources(resdivs.children);
    // };

    // let shufle = document.getElementById("shufle-resources");
    // shufle.onclick = () => {
    //     resourceArea.shufle(resdivs);
    // };

    return {game, resourceArea};
}