import Player from "../objects/player.mjs"
import PlayerFront from "../objects/playerFront.mjs";
import { ORGANISATIONS } from "../settings/gameSettings.mjs"
import Game, { GameEvents } from "./game.mjs"
import { Socket } from "socket.io";


const gameList: Game[] = []

export default {

    /**
     * 
     * @returns 
     */
    async getGame(socket: Socket) {
        if (gameList.length === 0) {
            var game = new Game(3, {frontPlayer: true})

            Object.values(GameEvents).forEach( evn => {
                game.addEventListener(evn as GameEvents, this.onGameEvent)
            })

            gameList.push(game)
            await game.init()
            const player = game.players.find(p => p.type === 'front')
            if( player && PlayerFront.isPlayerFront(player) ) {
                player.socket = socket
            }
            game.startGame()
            return game
        } else {
            var game = gameList[0]
            socketManager.sprayGameUpdate(game, 'onLogin')
            return game
        }
    },


    /**
     * 
     * @param event 
     * @param data 
     */
    async onGameEvent(event: GameEvents, data?: {game: Game, [k:string]: any}) {

        console.log("On", event)
        if (data) {
            await socketManager.sprayGameUpdate(data.game, event)
        }
    },

    /**
     * 
     */
    export(game: Game, playerSecret: string) {

        const player: Player | undefined = game.players.find(n => n.secretUuid === playerSecret)
        
        const ctx = {
            uuid: game.uuid,
            currentPlayer: player?.uuid,
            organisations: Object.values(ORGANISATIONS),
            selectableCards: [],
            selectableVisitors: [],
            visibleCards: [],
            visibleVisitors: !player ? [] : game.board.visitors.filter(v => v.seen.includes(player)).map(v => v.uuid),
            visitors: game.board.visitors.filter(v => v.position.where !== 'queue').map(v => v.export(player)),
            players: game.players.map(p => p.export(player))
        }

        return ctx
    }

}