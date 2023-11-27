import { ORGANISATIONS } from "../settings/gameSettings.mjs";
import { CONSOLE_COLOR } from "../types/consoleColor.mjs";
import Board from "./board.mjs";
import Entity from "./entity.mjs";
import Player from "./player.mjs";

type IWhere = 'queue' | 'entrance' | 'organisation' | 'enrolled'

export default class Visitor extends Entity {

    readonly name: string
    readonly value: number
    readonly seen: Player[] = []

    private _invitedBy?: Player
    private _board?: Board
    private _position: { where: IWhere, orga?: ORGANISATIONS, steps?: number} = { where: 'queue'}

    constructor(name: string, value: number) {
        super()

        this.name = name
        this.value = value
    }

    get position() {
        return this._position
    }

    get invitedByPlayer() {
        return this._invitedBy
    }

    export(forPlayer?: Player): { [k: string]: any; uuid: string; } {
        return {
            value: forPlayer && this.seen.includes(forPlayer) ? this.value : undefined,
            position: this._position,
            invitedBy: {uuid: this._invitedBy?.uuid, color: this._invitedBy?.color},
            seen: this.seen.map(p => p.uuid),
            ...super.export(forPlayer)
        }
    }

    setPosition(where: IWhere, orga?: ORGANISATIONS, steps?: number) {
        this._position.where = where
        this._position.orga = orga
        this._position.steps = steps
    }

    place(board: Board) {
        this.reset()
        this._board = board
    }

    invitedBy(player: Player) {
        this._invitedBy = player
        this.seenBy(player)
        if (player.type === 'console') {
            console.log(`${CONSOLE_COLOR.green}You have welcomed visitor ${this.uuid} : ${this.name} (${this.value})${CONSOLE_COLOR.white}`)
        }
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