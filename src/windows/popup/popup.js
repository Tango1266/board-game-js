export default class Popup {
    constructor(args) {
        this.divPopup = null;
        this.divContainer = null;
        this.divContent = null;
        this.divbutton = null;
        this.background = null;
        if (args && args.console) this.useConsole = args.console;

        this.isVisible = false;
    }

    set contentHtml(html) {
        this.divContent.innerHTML = html;
    }

    get btnAction() {
        return this.divbutton.onclick;
    }
    set content(content) {
        this.divContent.innerText = content;
    }

    set btnAction(action) {
        this.divbutton.onclick = action;
    }

    then(callback) {
        const tmpBtnAction = this.btnAction;
        this.btnAction = (args) => {
            callback(args);
            tmpBtnAction(args);
        }
        return this;
    }

    alert(content) {
        if (!this.isVisible) this.show();
        this.content = content;
        if (this.useConsole) console.log(content);
        return this;
    }

    show() {
        if (!this.divPopup) this.create();
        document.body.append(this.divPopup);
        this.isVisible = true;
        return this;
    }

    hide() {
        this.divPopup.remove();
        this.isVisible = false;
    }

    create() {
        this.divPopup = document.createElement("div");
        this.divPopup.className = "popup";

        this.background = document.createElement("div");
        this.background.className = "popup-background";

        this.divContainer = document.createElement("div");
        this.divContainer.className = "popup-container";
        //content
        this.divContent = document.createElement("div");
        this.divContent.className = "popup-content";
        //button
        this.divControls = document.createElement("div");
        this.divControls.className = "popup-controls";
        this.divbutton = document.createElement("div");
        this.divbutton.className = "popup-button";
        this.divbutton.onclick = () => {
            this.hide();
        };
        this.divbutton.innerText = "OK";
        this.divControls.append(this.divbutton);

        this.divPopup.append(this.background);
        this.divPopup.append(this.divContainer);
        this.divContainer.append(this.divContent);
        this.divContainer.append(this.divControls);

        return this;
    }
}