import Card from "./card.mjs"


export enum ANIMCARD_TYPE {
    Disguise= "Disguise",
    Crowd= "Crowd",
    FireAlarm= "FireAlarm",
    SuperGoodies= "SuperGoodies",
    GoodiesOnLeft= "GoodiesOnLeft",
    GoodiesOnRight= "GoodiesOnRight",
    InkOutage= "InkOutage",
    IncreasedSurveillance= "IncreasedSurveillance",
    Improvisation= "Improvisation",
    SecurityStrike= "SecurityStrike",
    OnTheFly= "OnTheFly",
    Espionage= "Espionage",
    SpecialConference= "SpecialConference",
    Paranoia= "Paranoia",
    FriendlyNeighbor= "FriendlyNeighbor",
}


export default class CardAnimation extends Card {

    readonly type: ANIMCARD_TYPE

    constructor(type: ANIMCARD_TYPE) {
        super()
        this.type = type
    }

    reset(): void {
    }

}