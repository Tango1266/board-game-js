import State from "../state";
import Player from "../player";
import Board from "../components/board/board-component/board";
import Table from "../components/table/table-component/table";
import ResourceArea from "../components/table/resourcearea-component/resourceArea";
import SlotFactory from "./slotFactory";
import BuildingFactory from "./buildingFactory";
import ResourceFactory from "./resourceFactory";
import 'regenerator-runtime/runtime'
import CardFactory from "./cardFactory";
import CardArea from "../components/table/cardarea-component/cardArea";
import PlayerArea from "../components/table/playerarea-component/playerArea";
import Hand from "../components/table/hand-component/hand";
import { slotTypes, SlotType, buildingTypes } from "../types";
import DiceFactory from "./diceFactory";
import createButton from "../components/controls/controls";
import MyHtmlElement from "../components/htmlElement";
import { DiceControl } from "../components/controls/diceControl-component/diceControl";

export function assemble(playerData) {
    let game = new Table({ state: new State() });
    game.board = assembleBoard(game);
    game.players = assemblePlayers(game, playerData);
    game.dices = assembleDices(game);
    game.diceControl = assambleDiceControl(game);

    let resourceArea = assembleResourceArea(game);
    let cardArea = assembleCardArea(game);

    assambleMenuBar(game);

    return { game, resourceArea };
}

function assembleBoard(game) {
    let board = new Board({ game: game });
    let sf = new SlotFactory(board);
    board.buildingSlots = sf.makeBuildingSlots();
    board.resourceSlots = sf.makeRessourceSlots();
    return board;
}

function assembleDices(game) {
    const diceFactory = new DiceFactory(game);
    return diceFactory.makeDices(2);
}

function assemblePlayers(game, playerData) {
    let bf = new BuildingFactory();
    let players = [];
    for (var player of playerData) {
        let newPlayer = new Player(game, player.name);
        newPlayer.addArea(new PlayerArea(newPlayer))
            .addHand(new Hand(newPlayer, new SlotType(slotTypes.resourceCard)));

        newPlayer.gameObjects = {
            [buildingTypes.town.name]: bf.createTowns(newPlayer, 4),
            [buildingTypes.village.name]: bf.createVillages(newPlayer, 5),
            [buildingTypes.street.name]: bf.createStreets(newPlayer, 15),
        }

        players.push(newPlayer)
    }

    return players;
}

function assembleCardArea(game) {
    let cf = new CardFactory(game);
    let cards = {
        ore: cf.createOreCard(1),
        corn: cf.createCornCard(19),
        stone: cf.createStoneCard(19),
        wool: cf.createWoolCard(19),
        wood: cf.createWoodCard(19),
    }

    for (var cardKey in cards) {
        let cardArea = new CardArea();

        for (var card of cards[cardKey]) {
            card.parent = cardArea;
            card.init();
        }
        cardArea.init();
    }
}

function assambleDiceControl(game) {
    let diceControl = new DiceControl();
    diceControl.addControls([
        createButton("Würfeln",
            "role-dice",
            "role-dice", { onclick: () => diceControl.rollDices() })
    ]);
    return diceControl;
}

function assembleResourceArea(game) {
    // resources to load
    let rf = new ResourceFactory(game);
    let resources = {
        ore: rf.createOre(3),
        corn: rf.createCorn(4),
        stone: rf.createStone(3),
        wool: rf.createWool(4),
        wood: rf.createWood(4),
        dessert: rf.createDessert(1),
    };
    let resourceArea = new ResourceArea(game, resources);

    resourceArea.parent.addControls([
        createButton("Mischen", "resource-area-control", "shufle-resources", { onclick: () => { resourceArea.shufle() } }),
        createButton("Verteilen", "resource-area-control", "allocate-resource", { onclick: () => resourceArea.allocateResources() })
    ])

    // let us stack the resources in a cirle way 
    function* transformPos() {
        let i = 0;
        while (true) {
            while (i++ < 3) yield "marginLeft";
            while (i-- > 1) yield "marginTop";
            while (i++ < 3) yield "marginRight";
            while (i-- > 1) yield "marginBottom";
        }
    }
    let margin = transformPos();
    
    function getMarginValue(margin) { 
        let val = parseInt(margin); 
        return isNaN(val)? 0: val; 
    }

    let res = {...resources};
    let startOrderdResources = [
        res.wood.pop(), res.wool.pop(), res.ore.pop(), res.corn.pop(),
        res.corn.pop(), res.wood.pop(), res.stone.pop(), res.corn.pop(),
        res.wool.pop(), res.wool.pop(), res.ore.pop(), res.stone.pop(),
        res.wool.pop(), res.stone.pop(), res.wood.pop(),res.ore.pop(),
        res.corn.pop(), res.wood.pop(), res.dessert.pop()
    ]
    for (var resource of startOrderdResources) {
            resource.parent = resourceArea;
            let previousEl = resourceArea.getChildren()[resource.idCounter - 1];
            if (previousEl) {
                let marginnext = margin.next().value;
                let offset = 10;
                let prevMarginLeft = getMarginValue(previousEl.style.marginLeft);
                let prevMarginTop = getMarginValue(previousEl.style.marginTop);

                switch (marginnext) {
                    case "marginLeft":
                        resource.style.marginLeft = prevMarginLeft + offset + "px";
                        break;
                    case "marginTop":
                        resource.style.marginTop = prevMarginTop + offset + "px";
                        resource.style.marginLeft = prevMarginLeft + "px";
                        break;
                    case "marginRight":
                        resource.style.marginTop = prevMarginTop + "px";
                        resource.style.marginLeft = prevMarginLeft - offset + "px";
                        break;
                    case "marginBottom":
                        resource.style.marginTop = prevMarginTop - offset + "px";
                        resource.style.marginLeft = prevMarginLeft + "px";
                        break;
                }
            }
            resource.init();
    }

    return resourceArea;
}

function assambleMenuBar(game) {
    let header = new MyHtmlElement({ div: document.getElementById("header") });

    let endTurnHandler = function(e) {
        game.event.emit("endturn");
    }
    // header.addControls([createButton("Runde Beenden", "end-turn", "btn-end-turn", { onclick: endTurnHandler })])
    // header.addControls([createButton("Runde Beenden", "end-turn", "btn-end-turn", { onclick: endTurnHandler })])
        // debug: select
    let select = document.getElementsByName("change-state")[0];
    for (let phase in game.GAME_PHASES) {
        var option = document.createElement("option");
        option.text = phase;
        option.id = game.GAME_PHASES[phase];
        select.add(option);
    }

    // customized two-way-binding on game.currentphase :)
    select.onchange = function(e) {
        this.currentPhase = this.GAME_PHASES[e.target.value];
    }.bind(game);
    select.options[game.currentPhase].selected = true;
    game.event.on("currentPhaseChanged").do((e) => select.options[game.currentPhase + 1].selected = true)

    // header - todo: extract
    window.onscroll = function() {
        const header = document.getElementById("header");
        const sticky = header.offsetTop;

        if (window.pageYOffset + 1 > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }
}