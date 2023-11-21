import Entity from "./entity.mjs";
import Player from "./player.mjs";

export default class Team extends Entity {

    readonly name: string
    readonly limit: number
    readonly type: 'fbi' | 'recruiter'
    readonly players: Player[] = []

    constructor(name: string, limit: number, type: 'fbi' | 'recruiter' = 'recruiter') {
        super()
        this.name = name
        this.limit = limit
        this.type = type
    }

    reset(): void {
        this.players.forEach(n => n.setTeam(undefined))
        this.players.length = 0
    }

    assign(player: Player) {
        this.players.push(player)
        player.setTeam(this)
    }


}