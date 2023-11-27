import { Server, Socket } from 'socket.io'
import http from 'http'
import onlineParty from "../controller/onlineParty.mjs"
import PlayerFront from '../objects/playerFront.mjs';
import Game from '../controller/game.mjs';

export enum SocketReceived {
    handshake = 'handshake'
}

export enum SocketSend {
    handshake = 'handshake',
    fullgame = 'fullgame',
    ask = 'ask',
}

export default class SocketIOMng {

    private io: Server
    private countConnectedUser: number = 0
    private listeners: {event: SocketReceived, callback: (event: SocketReceived, message: any, socket: Socket) => void}[] = []

    constructor(server: http.Server) {
        this.io = new Server(server)

        this.io.on('connection', (socket) => {
            this.countConnectedUser++
            console.log("User connected")

            // Bind events
            Object.values(SocketReceived).forEach(e => {
                socket.on(e, (message: any) => {
                    this.listeners.filter(n => n.event === e).forEach(n => n.callback(e, message, socket))
                })
            })
            // Start handshake
            socket.emit(SocketSend.handshake, {})

            socket.on(SocketReceived.handshake, async () => {
                console.log("handshake received")
                // if (socket.request.headers.cookie) {
                //     const cookies = parse(socket.request.headers.cookie)      
                // } 
                const game = await onlineParty.getGame(socket)
            })

            socket.on('disconnect', () => {
                this.countConnectedUser--
                console.log("User disconnected")
            });
        });
    }

    /**
     * Get amount of connected user
     */
    get nbUsers(): number {
        return this.countConnectedUser
    }


    async sprayGameUpdate(game: Game, sourceEvent: string) {
        console.log("After event", sourceEvent, "Send updated info")
        await Promise.all(
            game.players.map(async p => {
                if (PlayerFront.isPlayerFront(p)) {
                    console.log("Try to send game info to ", p.uuid, p.name)
                    const data = {sourceEvent, ...onlineParty.export(game, p.secretUuid)}
                    console.log(JSON.stringify(data))
                    p.socket?.emit(SocketSend.fullgame, data)
                }
            })
        )
    }


    /**
     * Send a message to all connected user
     * @param event 
     * @param message 
     */
    broadcast(event: string, message: {[k:string]: any}, room: string ) {
        this.io.to(room).emit(event, message)
    }

    /**
     * Add callback function to event
     * @param event 
     * @param callback 
     */
    addListner(event: SocketReceived, callback: (event: SocketReceived, message: any, socket: Socket) => void  ) {
        this.listeners.push( {event, callback})
    }

}