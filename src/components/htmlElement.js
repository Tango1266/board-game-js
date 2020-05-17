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

    static getAll() {
        return Array.from(instanceMap).reduce((k, v) => {
            return k.concat(v[1]);
        }, []);
    }

    get isEmpty() {
        return this.div.children.length <= 0;
    }

    getChild() {
        return instanceMap.get(this.div.children[0].id)
    }

    getChildren() {
        return Array.from(this.div.children).map((e) => { return MyHtmlElement.getElementById(e.id) });
    }

    add(child, callbackChild) {
        if (child === undefined) return;
        return this.doAdd(child, callbackChild);
    }

    addAfter(relChild, callbackChild) {
        if (relChild === undefined) return;
        const relObject = relChild instanceof MyHtmlElement? relChild : MyHtmlElement.getElementById(relChild.id);
        const relObjectParent = MyHtmlElement.getElementById(relObject.div.parentElement.id)
        relObjectParent.doAdd(this, callbackChild, "after", relObject);
        return this;
    }

    addTo(parent, callbackChild) {
        if (parent === undefined) return;
        const parentObject = parent instanceof MyHtmlElement? parent : MyHtmlElement.getElementById(parent.id);
        parentObject.doAdd(this, callbackChild);
        return this;
    }
    // todo: extract to utils 
    doAdd(child, callbackChild, order, relChild) {
        const objectToAdd = child instanceof MyHtmlElement ? child.div : child
        const relObject = relChild instanceof MyHtmlElement ? relChild.div : relChild
        switch (order) {
            case "before":
                this.div.insertBefore(objectToAdd, relObject);
                break;
            case "after":
                this.div.insertBefore(objectToAdd, relObject.nextElementSibling);
                break;
            default:
                this.div.append(objectToAdd);
        }

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
        return this;
    }

    show() {
        setTimeout(() => this.removeClass("invisible"), 0);
        return this;
    }

    adjustDimensionsToContent(relative) {
        let maxWidth = 0,
            maxHeight = 0;
        Array.prototype.forEach.call(this.div.children, (child) => {
            maxWidth = Math.max(maxWidth, child.offsetLeft + child.clientWidth);
            maxHeight = Math.max(maxHeight, child.offsetTop + child.clientHeight);
        });
        this.div.style.width = maxWidth + "px";
        this.div.style.height = maxHeight + "px";
    }

    get isOverflown() {
        return this.div.scrollWidth > this.div.clientWidth || this.div.scrollHeight > this.div.clientHeight;
    }
}