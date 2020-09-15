let htmlEvents = {};

export function addCSSRule(sheet, selector, rules, index) {
    //document.stylesheet[0].cssRules[selector][rules]
    var sheet = sheet ? sheet : document.styleSheets[0];
    var cssRules = sheet.cssRules || sheet.rules;

    for (var rule of cssRules) {
        if (rule.selectorText === selector) {

            var ruleParts = rules.split(':');
            rule.style[ruleParts[0]] = ruleParts[1];
            return;
        }
    }
    if ("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    } else if ("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
    }
}

export function changeClass(instance, className) {
    if (instance.div.className === className) {
        return;
    }
    instance.lastClassname = instance.div.className;
    instance.className = className;
    instance.div.className = className;
}

export function addClass(instance, className) {
    if (instance.div.className.includes(className)) {
        return;
    }
    let newClass = instance.div.className + " " + className;
    changeClass(instance, newClass);
}

export function removeClass(instance, classname) {
    if (!instance.div.className.includes(classname)) {
        return;
    }

    let newClass = instance.div.className.replace(" " + classname, "");
    changeClass(instance, newClass);
}

export function hasClass(instance, classname) {
    return instance.div.className.includes(classname);
}

export function setPosition(instance, xPos, yPos) {
    instance.div.style.position = "absolute";

    switch (typeof xPos) {
        case "number":
            instance.div.style.left = xPos + 'px';
            instance.div.style.top = yPos + 'px';
            break;
        case "string":
            instance.div.style.left = xPos;
            instance.div.style.top = yPos;
            break;
    }
}

export function getHtmlEvents() {
    if (Object.keys(htmlEvents).length <= 0) {
        for (let el in HTMLElement.prototype) {
            if (el.startsWith("on")) {
                htmlEvents[el] = null;
            }
        }
    }
    return htmlEvents;

}