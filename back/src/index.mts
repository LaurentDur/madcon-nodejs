import Game from "./controller/game.mjs";
import { CONSOLE_COLOR } from "./types/consoleColor.mjs";

console.log(`${CONSOLE_COLOR.blue}

███▄ ▄███▓ ▄▄▄      ▓█████▄  ▄████▄   ▒█████   ███▄    █      ▄████  ▄▄▄       ███▄ ▄███▓▓█████ 
▓██▒▀█▀ ██▒▒████▄    ▒██▀ ██▌▒██▀ ▀█  ▒██▒  ██▒ ██ ▀█   █     ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓█   ▀ 
▓██    ▓██░▒██  ▀█▄  ░██   █▌▒▓█    ▄ ▒██░  ██▒▓██  ▀█ ██▒   ▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒███   
▒██    ▒██ ░██▄▄▄▄██ ░▓█▄   ▌▒▓▓▄ ▄██▒▒██   ██░▓██▒  ▐▌██▒   ░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄ 
▒██▒   ░██▒ ▓█   ▓██▒░▒████▓ ▒ ▓███▀ ░░ ████▓▒░▒██░   ▓██░   ░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░▒████▒
░ ▒░   ░  ░ ▒▒   ▓▒█░ ▒▒▓  ▒ ░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒     ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░
░  ░      ░  ▒   ▒▒ ░ ░ ▒  ▒   ░  ▒     ░ ▒ ▒░ ░ ░░   ░ ▒░     ░   ░   ▒   ▒▒ ░░  ░      ░ ░ ░  ░
░      ░     ░   ▒    ░ ░  ░ ░        ░ ░ ░ ▒     ░   ░ ░    ░ ░   ░   ░   ▒   ░      ░      ░   
       ░         ░  ░   ░    ░ ░          ░ ░           ░          ░       ░  ░       ░      ░  ░
                      ░      ░                                                                   
${CONSOLE_COLOR.white}`)

const game = new Game(3, true)
// Init game
await game.init()
const scores = await game.startGame()

console.log( scores.scores )
console.log( scores.teams )
console.log( game.stats.tidy() )

