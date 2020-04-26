import { addCSSRule, changeClass, addClass, setPosition } from "../utils/domUtils";

const instanceMap = new Map();
const eventObservers = new Map();

export default class MyHtmlElement {

    constructor({ id = null, className = null, div = null, dragable = false, src = null, parent = null } = {}) {
        this.div = div || document.createElement("div");
        this.div.id = id || div.id;
        this.div.className = className || div.className;
        this.classNameDefault = this.div.className;
        this.lastClassName = this.div.className;
        this.div.dragable = dragable,
        this.div.src = src;
        this.parent = parent || MyHtmlElement.getElementById(this.div.id);

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

    makeDelayCallback(func, delay) {
        return (args) => setTimeout(func.bind(this), 0, args);
    }
}