import { addCSSRule, changeClass, addClass, setPosition, removeClass } from "../utils/domUtils";

const instanceMap = new Map();
const eventObservers = new Map();

export default class MyHtmlElement {

    constructor({ id = null, className = null, div = null, draggable = false, src = null, parent = null } = {}) {
        this.div = div || document.createElement("div");
        this.div.id = id || div.id;
        this.div.className = className || div.className;
        this.classNameDefault = this.div.className;
        this.lastClassName = this.div.className;
        this.div.draggable = draggable,
            this.div.src = src;
        this.parent = parent || MyHtmlElement.getElementById(this.div.id);

        if (src) {
            let head = document.getElementsByTagName("head")[0];
            let div = document.getElementById(this.div.id);
            if (!div) head.append(this.div)

        }

        if (!instanceMap.has(id))
            instanceMap.set(id, this);
    }

    static getElementById(id) {
        return instanceMap.get(id);
    }

    get isEmpty() {
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
        return this;
    }

    setPos(xPos, yPos) {
        setPosition(this, xPos, yPos);
    }

    addClass(classname) {
        addClass(this, classname);
        return this;
    }

    changeClass(className) {
        changeClass(this, className);
        return this;
    }

    removeClass(classname) {
        removeClass(this, classname)
        return this;
    }

    addCSSRule(sheet, selector, rules, index) {
        addCSSRule(sheet, selector, rules, index);
        return this;
    }

    makeDelayCallback(func, delay) {
        return (args) => setTimeout(func.bind(this), 0, args);
    }

    hide() {
        setTimeout(() => this.addClass("fade"), 1);
        setTimeout(() => this.addClass("invisible"), 0);
        // this.addClass("invisible");
        return this;
    }
}