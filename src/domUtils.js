

export function addCSSRule(sheet, selector, rules, index) {
    //document.stylesheet[0].cssRules[selector][rules]
    var sheet = document.styleSheets[0];
    var cssRules = sheet.cssRules || sheet.rules;

    for (var rule of cssRules) {
        if (rule.selectorText === selector) {

            var ruleParts = rules.split(':');
            rule.style[ruleParts[0]] = ruleParts[1];
            if (rule.style.hasOwnProperty(ruleParts[0])){
                console.log('test :', test);
            }
            return;
        }
    }
    if ("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    }
    else if ("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
    }
}

export function changeClass(instance, className) {
    if (instance.div.className === className) {
        return;
    }
    instance.lastClassname = instance.div.className;
    instance.div.className = className;
}

export function addClass(instance, className) {
    if (instance.div.className.includes(className)) {
        return;
    }
    let newClass = instance.div.className + " " + className;
    changeClass(instance, newClass);
}

export function removeClass(instance,classname) {
    if (!instance.div.className.includes(className)) {
        return;
    }

    let newClass = instance.div.className.replace(" " + classname, "");
    changeClass(newClass);
}
