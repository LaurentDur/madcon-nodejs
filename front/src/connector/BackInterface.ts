import socketMng, { SocketReceived, SocketSend } from '../socket/SocketMng'
import { IGameContext } from '../types/IGameContext'

export default class BackInterface {

    private _callBack?: ((ctx:IGameContext) => void)
    private _isConnected: boolean = false

    constructor() {
        this.bindSocket()
    }

    get isConnected() {
        return this._isConnected
    }

    private setConnectedState(isConnected: boolean) {
        console.log("WS connected", isConnected)
        this._isConnected = isConnected
    }

    send(event: SocketSend, message: {[k:string]: any}) {
        socketMng.emit(event, message)
    }

    onContextChange(fct: (ctx: IGameContext) => void) {
        this._callBack = fct
    }

  
    bindSocket() {
        
        socketMng.socket.on('connect', () => this.setConnectedState(true))
        socketMng.socket.on('disconnect', () => this.setConnectedState(false))
        
        socketMng.socket.on(SocketReceived.handshake, (args) => {
            
            // TODO
            console.log('Received handshake question!', 'Send handshake')
            socketMng.socket.emit(SocketSend.handshake, {})
        })

        
        socketMng.socket.on(SocketReceived.fullGame, (args) => {
            
            console.log('Received full')
            console.log(args)

            if (this._callBack) this._callBack(args)

        })

        
        socketMng.socket.on(SocketReceived.ask, (args) => {
            
            console.log('Received Ask')
            console.log(args)

        })

        socketMng.connect()
        socketMng.socket.emit(SocketSend.handshake, {})
    }

}