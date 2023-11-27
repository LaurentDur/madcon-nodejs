import { socket } from './Socket'

export enum SocketSend {
    handshake = 'handshake',
    cardSelected = 'cardSelected',
    visitorSelected = 'visitorSelected',
    orgaSelected = 'orgaSelected',
    missionSelected = 'missionSelected',
}

export enum SocketReceived {
    handshake = 'handshake',
    fullGame = 'fullgame',
    ask = 'ask',
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