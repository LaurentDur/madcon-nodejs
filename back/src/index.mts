import Game from "./controller/game.mjs";
import { CONSOLE_COLOR } from "./types/consoleColor.mjs";
import server, { app } from "./lib/ExpressConfig.mjs";

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

// const game = new Game(3, false)
// // Init game
// await game.init()
// const scores = await game.startGame()

// console.log( scores.scores )
// console.log( scores.teams )
// console.log( game.stats.tidy() )


app.get('/', (req, res) => {
       res.send("Mad'Con Boardgame... but online...")
})

// ---------------------------------------------
// Start server
// ---------------------------------------------
const PORT = 80
const SSL = false
server.listen(PORT, () => {
  // test
  console.log(`Go to http${SSL ? 's' : ''}://localhost:${PORT}/`)
})
