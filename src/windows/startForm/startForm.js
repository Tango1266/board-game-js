import Popup from "../popup/popup";

/**
 * Just a quick Form which should definitely be revised when there is a backend
 */
export default class StartForm {
    constructor() {
        this.div = null;
        this.popup = null;
        this.data = null;
        this.action = null;
    }

    onSubmit(e) {
        const formGroups = document.getElementsByClassName("form-group");
        const payload = [];
        Array.from(formGroups).forEach((g, index) => {
            const [input, checkbox] = g.children;
            if (!checkbox.checked && input.value.trim() !== "")
                payload.push({name: input.value.trim()})
            if (checkbox.checked)
                payload.push({useBot: true})
        })
        if (payload.length <= 0 || payload.filter((p) => p.name).length <= 0)
            return
        this.data = payload;
        this.action();
    }

    show(callback) {
        if (!this.div) this.div = this.create();
        this.popup.contentHtml = this.div.innerHTML;
        const popupAction = this.popup.btnAction;
        this.action = (args) => {
            callback(args);
            popupAction(args);
        };
        this.popup.btnAction = this.onSubmit.bind(this);
        this.popup.show();
    }

    postPlayerData(playerData) {

    }

    create() {
        this.popup = new Popup().create();
        this.popup.divbutton.type = "submit";
        this.popup.background.className += " form-background";

        const newForm = document.createElement("form");
        newForm.name = this.constructor.name;

        for (var i = 0; i <= 4; i++) {
            const input = document.createElement("input");
            input.id = "input-player-" + i;
            input.className = "form-input";
            input.placeholder = "Name Spieler " + i;


            const checkBox = document.createElement("input")
            checkBox.id = "bot-checkbox-" + i;
            checkBox.type = "checkbox";
            checkBox.className = "form-checkbox";
            checkBox.innerHTML = "use bot"


            const formGroup = document.createElement("div");
            formGroup.className = "form-group";

            if (i === 0) {
                formGroup.className += "-title";
                const titelPlayer = document.createElement("div");
                titelPlayer.className = "form-title";
                titelPlayer.innerHTML = "Spieler";

                const titleBots = document.createElement("div");
                titleBots.className = "form-title";
                titleBots.innerHTML = "KI";
                formGroup.append(titelPlayer);
                formGroup.append(titleBots);
                newForm.append(formGroup);
                continue;
            }

            formGroup.append(input);
            formGroup.append(checkBox);

            newForm.append(formGroup);
        }

        document.addEventListener("input", (e) => {
            if (e.target && e.target.type === "checkbox") {
                let inputPlayer = e.target.previousSibling;
                if (e.target.checked)
                    inputPlayer.value = "KI"
                else
                    inputPlayer.value = ""

                inputPlayer.disabled = e.target.checked;
            }
        })

        return newForm;
    }
}