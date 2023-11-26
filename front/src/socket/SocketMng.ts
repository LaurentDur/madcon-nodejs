import { socket } from './Socket'

export enum SocketSend {
    handshake = 'handshake'
}

export enum SocketReceived {
    onHandshake = 'handshake',
    onFullGame = 'fullgame',
}

class SocketMng {

    get socket() {
        return socket
    }

    connect() {
        socket.connect();
    }

    disconnect() {
        socket.disconnect();
    }

    emit(event: SocketSend, message: {[k:string]: any}) {
        socket.emit(event, message)
    }

    
    // this.socketMng.socket.on(SocketBroadcastEvent.onAccessDenied, (args) => {
    //     this.listeners.filter(n => n.event === 'onAccessDenied').forEach(n => {
    //         n.fct('onAccessDenied', {})
    //     })
    // })
}

const obj = new SocketMng()
export default obj