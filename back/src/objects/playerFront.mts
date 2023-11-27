import { Socket } from "socket.io";
import Player from "./player.mjs";
import { SocketSend } from "../socket/SocketIOMng.mjs";

export default class PlayerFront extends Player {

    private _socket?: Socket

    constructor(color: string) {
        super("NS", color, 'front')
        
    }

    get socket(): Socket | undefined {
        return this._socket
    } 

    set socket(socket: Socket | undefined) {
        this._socket = socket
    }
    
    async chooseName() {
        const name = await this.ask("What is your name?")
        this._name = name
        console.log(`Hello ${name}!`)
    }

    async ask(question: string, context?: string) {
        return new Promise<string>((resolve, reject) => {

            if (this._socket) {
                this._socket.emit(SocketSend.ask, {
                    question,
                    context
                })
            }

        })
    }

    static isPlayerFront(player: Player): player is PlayerFront {
        return player.type === 'front'
      }

}