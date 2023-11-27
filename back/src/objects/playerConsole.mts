import { CONSOLE_COLOR } from "../types/consoleColor.mjs";
import Player from "./player.mjs";
import readline from "readline"

const consoleRead = readline.createInterface({
       input: process.stdin,
       output: process.stdout
});
     

export default class PlayerConsole extends Player {

    constructor(color: string) {
        super("NS", color, 'console')
        
    }
    
    async chooseName() {
        const name = await this.ask("What is your name?")
        this._name = name
        console.log(`Hello ${name}!`)
    }

    async ask(question: string, context?: string) {
        return new Promise<string>((resolve, reject) => {
            if (context) console.log(`${CONSOLE_COLOR.green}${context}${CONSOLE_COLOR.white}`)
            consoleRead.question(question + "\n", input => {
                // consoleRead.close();
                resolve(input)
         });
        })
    }

    static isPlayerConsole(player: Player): player is PlayerConsole {
        return player.type === 'console'
      }

}