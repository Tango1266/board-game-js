import createButton from "../../components/controls/controls";

export default class Popup {
    constructor() {
        this.divBackground = null;
        this.divContainer = null;
        this.divContent = null;
    }

    set content(content) {
        this.divContent.innerText = content;
    }

    create() {
        this.divBackground = document.createElement("div");
        this.divBackground.className = "popup-background";
        this.divContainer = document.createElement("div");
        this.divContainer.className = "popup-container";
        //content
        this.divContent = document.createElement("div");
        this.divContent.className = "popup-content";
        //button
        this.divControls = document.createElement("div");
        this.divControls.className = "popup-controls";
        const divbutton = document.createElement("div");
        divbutton.className = "popup-button";
        divbutton.onclick = () => {
            this.hide();
        };
        divbutton.innerText = "OK";
        this.divControls.append(divbutton);

        this.divBackground.append(this.divContainer);
        this.divContainer.append(this.divContent);
        this.divContainer.append(this.divControls);
        document.body.append(this.divBackground);
    }

    alert(content) {
        if (!this.divContent) this.create();
        this.content = content;
    }

    hide(){
        this.divBackground.remove();
    }
}