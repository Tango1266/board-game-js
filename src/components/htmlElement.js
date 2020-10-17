import { addCSSRule, changeClass, addClass, setPosition, removeClass, getHtmlEvents, hasClass } from "../utils/domUtils";

const instanceMap = new Map();
const eventObservers = new Map();


export default class MyHtmlElement {

    constructor({ id = null, className = null, div = null, draggable = false, src = null, parent = null } = {}) {
        this.div = div || document.createElement("div");
        this.div.id = id || div.id;
        this.div.className = className || div.className;
        this.classNameDefault = this.div.className;
        this.lastClassName = this.div.className;
        this.div.draggable = draggable;
        this.div.src = src;
        this.parent = parent || MyHtmlElement.getElementById(this.div.id);
        this.events = null;

        if (src) {
            let head = document.getElementsByTagName("head")[0];
            let div = document.getElementById(this.div.id);
            if (!div) head.append(this.div)
        }

        if (!instanceMap.has(this.div.id))
            instanceMap.set(this.div.id, this);
    }

    static getElementById(id) {
        return instanceMap.get(id);
    }

    static getElements() {
        return instanceMap;
    }
    static getAll() {
        return Array.from(instanceMap).reduce((k, v) => {
            return k.concat(v[1]);
        }, []);
    }

    get id() {
        return this.div.id;
    }

    set id(id) {
        this.div.id = id;
        return this;
    }

    get imgSrc() {
        return this.div.src;
    }

    set imgSrc(src) {
        this.div.src = src;
        return this;
    }

    makeEvents() {
        // todo: Event could be own type/class
        let events = getHtmlEvents();
        // populate html-events with custome eventhandler functionality
        for (let ev in events) {
            events[ev] = {
                "do": function(callback, instanceToBind) {
                    this.div[ev] = instanceToBind ? callback.bind(instanceToBind) : callback.bind(this);
                }.bind(this)
            }
        }
        // emit custome event
        events["emit"] = function(eventName, emittingInstance, payloadJson, bubbles) {
            let event = new Event(eventName);
            if (payloadJson || bubbles) event = new CustomEvent(eventName, { "detail": payloadJson, "bubbles": bubbles || false })
            const instance = emittingInstance || this;
            instance.div.dispatchEvent(event)
        }.bind(this);
        // create custome event and respective handler
        events["on"] = function(newEvent) {
            events[newEvent] = {
                "do": function(callback, instanceToBind) {
                    if (instanceToBind) this.div.addEventListener(newEvent, callback.bind(instanceToBind));
                    else this.div.addEventListener(newEvent, callback.bind(this));
                }.bind(this)
            };
            return events[newEvent];
        }.bind(this);

        return Object.assign({}, events);
    }

    get isEmpty() {
        return this.div.children.length <= 0;
    }

    get isDraggable() {
        return this.div.draggable;
    }

    set isDraggable(bool) {
        this.div.draggable = bool;
    }

    set color(color) {
        this.div.style.filter = color;
    }

    setWidth(width) {
        this.div.width = width;
        return this;
    }

    setHeight(height) {
        this.div.height = height;
        return this;
    }

    getChild() {
        const child = this.div.children[0];
        if(child) return instanceMap.get(child.id);
        return null;
    }

    getChildren() {
        return Array.from(this.div.children).map((e) => { return MyHtmlElement.getElementById(e.id) });
    }

    add(child, callbackChild) {
        if (child === undefined) return;
        return this.doAdd(child, callbackChild);
    }

    addAll(children, callbackChild){
        for(var child of children){
            this.add(child,callbackChild);
        }
    }

    removeAll() {
        let children = Array.from(this.div.children);
        for (var child of children) {
            this.remove(child);
        }
    }

    remove(child) {
        const hasChild = Array.from(this.div.children).find((e) => e.id === child.id);
        if (hasChild) {
            const objectToRemove = child instanceof MyHtmlElement ? child.div : child;
            this.div.removeChild(objectToRemove);
        }
    }

    addAfter(relChild, callbackChild) {
        if (relChild === undefined) return;
        const relObject = relChild instanceof MyHtmlElement ? relChild : MyHtmlElement.getElementById(relChild.id);
        const relObjectParent = MyHtmlElement.getElementById(relObject.div.parentElement.id)
        relObjectParent.doAdd(this, callbackChild, "after", relObject);
        return this;
    }

    addTo(parent, callbackChild) {
        if (parent === undefined) return;
        const parentObject = parent instanceof MyHtmlElement ? parent : MyHtmlElement.getElementById(parent.id);
        parentObject.doAdd(this, callbackChild);
        return this;
    }
    
    doAdd(child, callbackChild, order, relChild) {
        const objectToAdd = child instanceof MyHtmlElement ? child.div : child;
        const relObject = relChild instanceof MyHtmlElement ? relChild.div : relChild;

        if(child instanceof MyHtmlElement) {
            child.parent = this;
        }
        
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

    hasClass(classname) {
        return hasClass(this, classname);
    }

    get inspect() {
        return this.div;
    }

    get style() {
        return this.div.style;
    }

    addCSSRule(sheet, selector, rules, index) {
        addCSSRule(sheet, selector, rules, index);
        return this;
    }

    makeDelayCallback(func, delay) {
        if (!delay) delay = 0;
        return (args) => setTimeout(func.bind(this), delay, args);
    }

    addControls(controls) {
        const containerName = this.div.classList[0] + "-controls";
        let controlsContainer = Array.from(this.div.children).find((c) => c.id === containerName);
        if (controlsContainer == null) {
            controlsContainer = document.createElement("div");
            controlsContainer.className = containerName;
            controlsContainer.id = containerName;
            this.add(controlsContainer);
        }

        controls.forEach((control) => {
            controlsContainer.append(control);
        })
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

    adjustDimensionsToContent({left=0, top=0}= {}) {
        let maxWidth = 0,
            maxHeight = 0;
        Array.prototype.forEach.call(this.div.children, (child) => {
            maxWidth = Math.max(maxWidth, child.offsetLeft + child.clientWidth);
            maxHeight = Math.max(maxHeight, child.offsetTop + child.clientHeight);
        });
        this.div.style.width = (maxWidth + left) + "px";
        this.div.style.height = (maxHeight + top)+ "px";
    }

    get isOverflown() {
        return this.div.scrollWidth > this.div.clientWidth || this.div.scrollHeight > this.div.clientHeight;
    }

    get event() {
        if (!this.events) this.events = this.makeEvents();
        return this.events;
    }

    listen(eventname, func) {
        this.div[eventname] = func;
    }
}