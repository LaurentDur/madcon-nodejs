import socketMng, { SocketReceived, SocketSend } from '../socket/SocketMng'

export default class Game {

    send(event: SocketSend, message: {[k:string]: any}) {
        socketMng.emit(event, message)
    }

  
    bindSocket() {
        
        socketMng.socket.on(SocketReceived.onHandshake, (args) => {
            
            // TODO

        })

        
        socketMng.socket.on(SocketReceived.onFullGame, (args) => {
            
            // TODO

        })
    }

}