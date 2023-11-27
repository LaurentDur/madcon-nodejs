import Card from "./card.mjs"
import Player from "./player.mjs"


export enum ACTIONCARD_TYPE {
    Arguments= "Arguments",
    TargetedArguments = "TargetedArguments",
    Goodies = "Goodies",
    Hijacking = "Hijacking",
    CounterArgument = "CounterArgument",
    Investigation = "Investigation",
    MakeDisappear = "MakeDisappear",
    Security = "Security"
}

export const ACTIONCARDS = [
    {type: ACTIONCARD_TYPE.Arguments, nb: 3},
    {type: ACTIONCARD_TYPE.TargetedArguments, nb: 2},
    {type: ACTIONCARD_TYPE.Goodies, nb: 2},
    {type: ACTIONCARD_TYPE.Hijacking, nb: 2},
    {type: ACTIONCARD_TYPE.CounterArgument, nb: 2},
    {type: ACTIONCARD_TYPE.Investigation, nb: 1},
    {type: ACTIONCARD_TYPE.MakeDisappear, nb: 1},
    {type: ACTIONCARD_TYPE.Security, nb: 1},
]

export default class CardAction extends Card {

    readonly type: ACTIONCARD_TYPE

    constructor(type: ACTIONCARD_TYPE) {
        super()
        this.type = type
    }

    reset(): void {
    }

    export(forPlayer?: Player): { [k: string]: any; uuid: string } {
        return {
            action: this.owner !== forPlayer ? '' : this.type,
            ...super.export(forPlayer)
        }
    }
}