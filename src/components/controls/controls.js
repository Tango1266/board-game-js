
export default function createButton(text, className, id, props){
    let divButton = document.createElement("button");
    divButton.id = id
    divButton.className = "button " + className;
    divButton.innerText = text;

    if(props) {
        for(var prop in props){
            divButton[prop] = props[prop];
        }
    }
    return divButton;
}