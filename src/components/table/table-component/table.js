import MyHtmlElement from "../../htmlElement";
import Board from "../../board/board-component/board";
import 'regenerator-runtime/runtime'

const GAME_PHASES = {
    NOTINITALISED: -1,
    PREPARE: 0,
    FIRST_PLAYER: 1,
    POPULATE: 2,
    START: 3
}

function* nextPlayerGen(players, firstToRole, backwards) {
    let nextPlayerNumber = backwards ? firstToRole : firstToRole - 2;
    while (true) {
        if (backwards) nextPlayerNumber = (nextPlayerNumber - 1) % players.length;
        else nextPlayerNumber = (nextPlayerNumber + 1) % players.length;

        if (nextPlayerNumber < 0) nextPlayerNumber = players.length + nextPlayerNumber;
        // console.log("first: ", firstToRole, ", idx: ", nextPlayerNumber)

        yield players[nextPlayerNumber];
    }
}

let nextPlayer = () => {};

export default class Table extends MyHtmlElement {

    constructor({ players = [], state = {} } = {}) {
        super({
            parent: new MyHtmlElement({ div: document.getElementById("table-container") }),
            div: document.getElementById("table"),
        })
        this.players = players;
        this.state = state;
        this.isInitalized = false;

        this.GAME_PHASES = GAME_PHASES;
        this._currentPhase = GAME_PHASES.NOTINITALISED;

        this.board = null;
        this.dices = null;
        this.diceControl = null;
        this.firstPlayer = null;

        this.roundResults = new Map();
        this.roundResults.set("turnCount", 0);

    }

    get currentPhase() { return this._currentPhase }
    set currentPhase(phase) {
        this._currentPhase = phase;
        this.event.emit("currentPhaseChanged")
    }

    get buildingState() { return this.state.buildingSlots; }

    get nextPlayer() {
        let next = nextPlayer.next();
        return next.value;
    }

    init() {
        this.board.init();
        this.players.forEach((p) => p.init())
        this.initEventHnalder();
        return this;
    }

    initEventHnalder() {
        this.parent.event.on("boardinitialised").do(this.onInitGame, this);
        this.parent.event.on("diceroled").do(this.onDiceRoled, this);
        this.event.on("endturn").do(this.onEndTurn);
    }

    determineStartPlayer() {
        let firstToRole = Math.floor(Math.random() * (this.players.length)) + 1;
        nextPlayer = nextPlayerGen(this.players, firstToRole, false);
        let firstPlayerToRole = this.nextPlayer;
        firstPlayerToRole.giveDice(this.dices[0]);

        this.diceControl.addDice(this.dices[0])
            .giveControl(firstPlayerToRole)
            .showControl();
    }

    startGame() {
        this.startPhase(GAME_PHASES.PREPARE);
    }

    onDiceRoled(e) {
        const player = this.players.find((player) => player.id == e.detail.playerId);
        const result = e.detail.result.reduce((acumulator, currentValue) => acumulator + currentValue);
        const dices = e.detail.diceId.map((diceId) => this.dices.find((d) => d.id == diceId));

        //todo: extract log results maybe in a messaging queue
        console.log(`${player.name} hat ${result} gewürfelt mit: ${e.detail.result.join(', ')}`)

        this.displayResult(dices);

        switch (this.currentPhase) {
            case GAME_PHASES.FIRST_PLAYER:
                if (this.processPhaseFirstPlayer(player, result)) return;
                break;
            case GAME_PHASES.POPULATE:
                if (this.processPhasePopulate(player, result)) return;
                break;
        }
    }

    displayResult(dices) {
        const resultDisplays = Array.from(document.querySelectorAll(".dice-result")).map((e) => new MyHtmlElement({ div: e }));
        if (dices.length > resultDisplays.length)
            throw "OutOfBounds: more results than displays.";

        for (var i = 0; i < dices.length; i++) {
            resultDisplays[i].removeAll();
            resultDisplays[i].add(dices[i].showResult().cloneNode(true));
        }
    }

    /**
     * counterclockwise each player places a village and street
     * the last player places two villages and streets
     * then clockwise the remaining player places again a village and a street
     * todo: all player receive resources from their last placement 
     * @param {*} e Event parameter
     */
    processPhasePopulate(e) {
        if (this.currentPhase != GAME_PHASES.POPULATE) return;

        const getTurn = () => this.roundResults.get("turnCount");
        const player = this.players.find((player) => player.id == e.detail.playerId);
        const gamingObject = MyHtmlElement.getElementById(e.detail.buildingId);

        if (!this.roundResults.get(player.id))
            this.roundResults.set(player.id, [])

        this.roundResults.get(player.id).push(gamingObject);

        // player turn finished, when he places 2 gameobjects (village, street)
        const playerFinishedTurn = this.roundResults.get(player.id).length % 2 == 0;
        if (playerFinishedTurn) this.roundResults.set("turnCount", getTurn() + 1);

        // phase finished, when all player placed 4 gameobject. Each turn he places 2. Last player places 4.
        // e.g. 4 Player do in total 7 turns => maxTurns = numberOfPlayer * 2 - 1
        const phaseEnded = getTurn() >= this.players.length * 2;
        if (phaseEnded) {
            this.startPhase(GAME_PHASES.START);
            return;
        }

        const firstHalfOfPhase = getTurn() <= this.players.length - 1;
        let nextPlayerToRole = {};
        if (firstHalfOfPhase && playerFinishedTurn) {
            this.setPlayerInactive(player);
            nextPlayerToRole = this.nextPlayer;
            this.setPlayerActive(nextPlayerToRole);

        }

        const lastPlayerTurn = getTurn() == this.players.length - 1;
        if (lastPlayerTurn && playerFinishedTurn) {
            this.players.forEach((player) => {
                player.gameObjects.village.find(s => !s.isActive()).setActive();
                player.gameObjects.street.find(s => !s.isActive()).setActive();
            })
        }

        const secondHalfOfPhase = getTurn() > this.players.length;
        if (secondHalfOfPhase && playerFinishedTurn) {
            nextPlayer = nextPlayerGen(this.players, player.id, false);
            this.setPlayerInactive(this.nextPlayer);
            this.setPlayerActive(this.nextPlayer);
        }
    }

    /**
     * clockwise each player roles one dice
     * the player with the highest number is the first player of the game
     * on a draw, all player with the highest number role again
     */
    // bug: on draw, sometimes not all player get to role, only the firstToRole...
    processPhaseFirstPlayer(player, result) {
        const playerCount = this.roundResults.get("playerCount") || this.players.length;

        if (this.roundResults.get(result)) this.roundResults.get(result).push(player);
        else this.roundResults.set(result, [player]);

        this.roundResults.set("turnCount", this.roundResults.get("turnCount") + 1);

        // finished, everybody has rolled
        if (this.roundResults.get("turnCount") == playerCount) {
            let highestNum = Math.max(...Array.from(this.roundResults.keys()).filter(e => typeof(e) == "number"));
            let highestRoler = this.roundResults.get(highestNum);

            if (highestRoler.length > 1) {
                alert(`Draw between: ${highestRoler.map(hr => hr.name).join(", ")}`);
                nextPlayer = nextPlayerGen(highestRoler, highestRoler[0].id, false);
                this.resetRound(highestRoler.length);
                return false;
            }

            this.firstPlayer = highestRoler[0];
            const winMsg = `${highestRoler[0].name} beginnt das Spiel! Die höchste Zahl wurde mit ${highestNum} gewürfelt.`;
            console.log(winMsg)
            alert(winMsg)


            this.diceControl.hideControl();
            this.startPhase(GAME_PHASES.POPULATE);
            this.resetRound();
            return true;
        }
        player.setInactive();
        let nextPlayerToRole = this.nextPlayer;
        this.setPlayerActive(nextPlayerToRole);
        this.diceControl.giveControl(nextPlayerToRole).showControl();
    }


    startPhase(phase) {
        this.currentPhase = phase;
        switch (phase) {
            case GAME_PHASES.NOTINITALISED:
                console.log(`Initialisiere spiel...`);
                this.players.forEach(p => {
                    for (var go in p.gameObjects) {
                        p.gameObjects[go].forEach(g => g.setActive());
                    }
                    this.setPlayerActive(p);
                })
                break;
            case GAME_PHASES.PREPARE:
                console.log(`Neue Spielphase 'Spielvorbereitung' beginnt!`)
                this.setPlayerInactive(this.players);
                break;
            case GAME_PHASES.FIRST_PLAYER:
                console.log(`Neue Spielphase 'Erster Spieler' beginnt!`)
                const firstToRole = Math.floor(Math.random() * (this.players.length)) + 1;
                nextPlayer = nextPlayerGen(this.players, firstToRole, false);

                const firstPlayerToRole = this.nextPlayer;
                firstPlayerToRole.giveDice(this.dices[0]);
                this.setPlayerActive(firstPlayerToRole);
                this.diceControl.addDice(this.dices[0])
                    .giveControl(firstPlayerToRole).showControl();
                break;
            case GAME_PHASES.POPULATE:
                console.log(`Neue Spielphase 'Aufbau' beginnt!`)
                this.event.on("buildingplayed").do(this.processPhasePopulate);
                this.diceControl.addDice(this.dices[1]).giveControl(this.firstPlayer);
                let nonFirstPlayer = this.players.filter(p => p.id != this.firstPlayer.id);
                nextPlayer = nextPlayerGen(this.players, this.firstPlayer.id, true);
                this.setPlayerInactive(nonFirstPlayer);
                this.setPlayerActive(this.nextPlayer);
                this.players.forEach((player) => {
                    player.gameObjects.village[0].setActive();
                    player.gameObjects.street[0].setActive();
                })
                break;
            case GAME_PHASES.START:
                alert("Das Spiel beginnt! ... bald")
                break;
        }

    }

    resetRound(playerCount) {
        this.roundResults = new Map();
        this.roundResults.set("turnCount", 0);
        this.roundResults.set("playerCount", playerCount);
    }

    onInitGame(e) {
        this.startPhase(GAME_PHASES.FIRST_PLAYER);
    }

    onEndTurn() {
        console.log("End Turn");
        //game phase
        let nextPlayer = this.nextPlayer;
    }

    setPlayerActive(players) {
        if (!players) return;
        if (players.length > 1) players.forEach(p => p.setActive());
        else players.setActive();
    }

    setPlayerInactive(players) {
        if (!players) return;
        if (players.length > 1) players.forEach(p => p.setInactive());
        else players.setInactive();
    }
}