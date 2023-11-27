import { Socket } from "socket.io";
import Player from "./player.mjs";
import { SocketReceived, SocketSend } from "../socket/SocketIOMng.mjs";

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
    

    async ask(question: string, objects: {[k:string]: string[]}) {
        return new Promise<string>((resolve, reject) => {

            if (this._socket) {
                this._socket.emit(SocketSend.ask, {
                    question,
                    objects
                })
                let event: SocketReceived
                if (objects.card !== undefined) event =  SocketReceived.cardSelected
                else if (objects.mission !== undefined) event =  SocketReceived.missionSelected
                else event =  SocketReceived.visitorSelected

                const removeA = socketManager.addListener(event, (event: SocketReceived, data: any, socket: Socket) => {
                    // console.log(event, data)
                    if (data.player === this.uuid) {
                        resolve(data.uuid)
                        removeA()
                    }
                })
            }

        })
    }

    static isPlayerFront(player: Player): player is PlayerFront {
        return player.type === 'front'
      }

}