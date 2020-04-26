import { assemble } from "./assembling/assembler";

let playerData = [{name:"Daniele"}];
let assembled = assemble(playerData); 
assembled.game.init();
assembled.resourceArea.init();