import Board from "./board.mjs";
import Entity from "./entity.mjs";
import { ORGANISATIONS } from "./game.mjs";
import Player from "./player.mjs";


export default class Visitor extends Entity {

    readonly name: string
    readonly value: number
    readonly seen: Player[] = []

    private _invitedBy?: Player
    private _board?: Board
    private _position: { where: 'queue' | 'entrance' | 'organisation', orga?: ORGANISATIONS, steps?: number} = { where: 'queue'}

    constructor(name: string, value: number) {
        super()

        this.name = name
        this.value = value
    }

    get invitedByPlayer() {
        return this._invitedBy
    }

    place(board: Board) {
        this.reset()
        this._board = board
    }

    invitedBy(player: Player) {
        this._invitedBy = player
    }

    seenBy(player: Player) {
        this.seen.push(player)
    }

    reset(): void {
        this._board = undefined
        this._position.where = 'queue'
        this._position.orga = undefined
        this._position.steps = undefined
        this.seen.length = 0
    }

}