import MyHtmlElement from "../../htmlElement";

let diceId = 0;

export class DiceAnimation extends MyHtmlElement {
    constructor(player) {
        
        let divWrapper = document.createElement("div");
        divWrapper.id = "wrapper";
        divWrapper.innerHTML = `<input id="secondroll" name="roll" type="checkbox">
        <input id="roll" name="roll" type="checkbox">
        <label for="roll">Roll it!</label>`;

        let divPlatform = document.createElement("div");
        divPlatform.id = "platform";
        divWrapper.append(divPlatform);

        let divDice = document.createElement("div");
        divDice.id = "adice";
        divDice.className = "adice";
        divDice.innerHTML = `<div id="dice-side-1" class="side front">
        <div class="dotA dcenter"></div>
      </div>
      <div class="side front inner"></div>
      <div id="dice-side-2" class="side stop">
        <div class="dotA dtop dleft"></div>
        <div class="dotA dbottom dright"></div>
      </div>
      <div class="side stop inner"></div>
      <div id="dice-side-3" class="side sright">
        <div class="dotA dtop dleft"></div>
        <div class="dotA dcenter"></div>
        <div class="dotA dbottom dright"></div>
      </div>
      <div class="side sright inner"></div>
      <div id="dice-side-4" class="side sleft">
        <div class="dotA dtop dleft"></div>
        <div class="dotA dtop dright"></div>
        <div class="dotA dbottom dleft"></div>
        <div class="dotA dbottom dright"></div>
      </div>
      <div class="side sleft inner"></div>
      <div id="dice-side-5" class="side sbottom">
        <div class="dotA dcenter"></div>
        <div class="dotA dtop dleft"></div>
        <div class="dotA dtop dright"></div>
        <div class="dotA dbottom dleft"></div>
        <div class="dotA dbottom dright"></div>
      </div>
      <div class="side sbottom inner"></div>
      <div id="dice-side-6" class="side back">
        <div class="dotA dtop dleft"></div>
        <div class="dotA dtop dright"></div>
        <div class="dotA dbottom dleft"></div>
        <div class="dotA dbottom dright"></div>
        <div class="dotA dcenter dleft"></div>
        <div class="dotA dcenter dright"></div>
      </div>
      <div class="side back inner"></div>
      <div class="side cover x"></div>
      <div class="side cover y"></div>
      <div class="side cover z"></div>`;

        divPlatform.append(divDice);

        let resArea = document.getElementById("resource-area-container");
        resArea.append(divWrapper)

        super({
            div: divDice,
            draggable: true,
        })
        
        this.owner = player;
        this.currentResult = null; 
        this.id = "adice-"+ diceId++;
    }

    init() {
      // todo
    }

    roll(){
      this.currentResult = Math.ceil(Math.random() * 6);
      return this.currentResult; 
    }

    readResult(){
      return this.currentResult;
    }


}

