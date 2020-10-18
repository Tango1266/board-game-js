import createButton from "../../components/controls/controls";

export default class Popup {
    constructor(args) {
        this.divBackground = null;
        this.divContainer = null;
        this.divContent = null;
        
        if(args.console) this.useConsole = args.console; 

        this.isVisible = false;
    }

    set content(content) {
        this.divContent.innerText = content;
    }

    alert(content) {
        if (!this.isVisible) this.show();
        this.content = content;
        if(this.useConsole) console.log(content);
    }

    show(){
        if (!this.divBackground) this.create();
        document.body.append(this.divBackground);
        this.isVisible = true;
    }

    hide(){
        this.divBackground.remove();
        this.isVisible = false;
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
    }
}