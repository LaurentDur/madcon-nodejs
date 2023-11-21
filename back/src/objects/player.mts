import CardOrganisation from "./cardOrganisation.mjs";
import Entity from "./entity.mjs";
import Team from "./team.mjs";

export default class Player extends Entity {

    readonly name: string
    private _team?: Team
    private _hasSecurityToken: boolean = false

    private _deck_organisation: CardOrganisation[] = []

    constructor(name: string) {
        super()
        this.name = name
    }

    get hasSecurityToken() {
        return this._hasSecurityToken
    }

    get team() {
        return this._team
    }

    setTeam(team?: Team) {
        this._team = team
    }

    giveOrganisationCards(cards: CardOrganisation[]) {
        this._deck_organisation.push(...cards)
    }

    giveSecurityToken() {
        this._hasSecurityToken = true
    }

    takeSecurityToken() {
        this._hasSecurityToken = false
    }

    reset(): void {
        this._deck_organisation.length = 0
        this._hasSecurityToken = false
    }


}