import { addCSSRule, changeClass, addClass, setPosition } from "./domUtils";

let baseUrl = process.env.BASE_URL;
let instanceMap = new Map();

export default class MyHtmlElement {
    constructor({ id = null, className = null, div = null, dragable = false, src = null, parent = null } = {}) {
        this.div = div || document.createElement("div");
        this.div.id = id || div.id;
        this.div.className = className || div.className;
        this.classNameDefault = this.div.className;
        this.lastClassName = this.div.className;
        this.div.dragable = dragable,
        this.div.src = baseUrl + src;
        this.parent = parent || MyHtmlElement.getElementById(this.div.id);

        if (!instanceMap.has(id))
            instanceMap.set(id, this);
    }

    static getElementById(id) {
        return instanceMap.get(id);
    }

    isEmpty() {
        return this.div.children.length <= 0;
    }

    getChild() {
        return instanceMap.get(this.div.children[0].id)
    }

    add(child, callbackChild) {
        if (child === undefined) return;

        if (child instanceof MyHtmlElement)
            this.div.append(child.div);
        else
            this.div.append(child)

        if (callbackChild) callbackChild.call(child);
    }

    setPos(xPos, yPos) {
        setPosition(this, xPos, yPos);
    }

    addClass(classname) {
        addClass(this, classname);
    }

    changeClass(className) {
        changeClass(this, className);
    }

    removeClass(classname) {
        removeClass(this, classname)
    }

    addCSSRule(sheet, selector, rules, index) {
        addCSSRule(sheet, selector, rules, index);
    }
}