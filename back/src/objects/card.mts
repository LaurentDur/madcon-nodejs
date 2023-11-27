import Entity from "./entity.mjs"
import Player from "./player.mjs"



export default abstract class Card extends Entity {

    private _onwer?: Player

    constructor() {
        super()
    }

    take(player: Player) {
        this._onwer = player
    }

    release() {
        this._onwer = undefined
    }

    get owner() {
        return this._onwer
    }

    abstract reset(): void

    export(forPlayer?: Player): { [k: string]: any; uuid: string } {
        return {
            ower: this._onwer?.uuid,
            uuid: forPlayer === this.owner ? this.uuid : ''
        }
    }
}