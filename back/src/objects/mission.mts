import { ORGANISATIONS } from "../settings/gameSettings.mjs"
import { CONSOLE_COLOR } from "../types/consoleColor.mjs"
import CardAction from "./cardAction.mjs"
import CardOrganisation from "./cardOrganisation.mjs"
import Entity from "./entity.mjs"
import Player from "./player.mjs"


export default class Mission extends Entity {

    readonly action: CardAction
    readonly organisation: CardOrganisation
    readonly sabotage: {player: Player, card: CardOrganisation}[] = []
    readonly player: Player

    private _executed: boolean = false
    private _visible: 'organisaton' | 'action'

    constructor(action: CardAction, organisation: CardOrganisation, player: Player, visible: 'organisaton' | 'action' ) {
        super()
        this.action = action
        this.organisation = organisation
        this.player = player
        this._visible = visible
    }

    giveBackSabotageCards() {
        this.sabotage.forEach(s => {
            s.player.giveBackSabotageCard(s.card)
        })
        this.sabotage.length = 0
    }

    get visibleCard() {
        return this._visible
    }

    get executed() {
        return this._executed
    }

    get finalOrganisaiton() {
        
        let organisation: ORGANISATIONS = this.organisation.organisation
        if (this.sabotage.length > 0) {
            organisation = this.sabotage[ this.sabotage.length - 1 ].card.organisation
        }

        return organisation
    }

    setExecuted() {
        this._executed = true
    }

    reset(): void {
        this.sabotage.length = 0
    }

    doSabotage(player: Player, card: CardOrganisation) {
        this.sabotage.push({player, card})
    }

    verbose(): string[] {
        const log: string[] = []

        log.push(` ${CONSOLE_COLOR.gris}${this.action.type} / ${this.organisation.organisation} (${this._visible})${CONSOLE_COLOR.white}`)
        this.sabotage.forEach(s => {
            log.push(`   ${CONSOLE_COLOR.blue}Has sabotage by ${s.player.name} with ${s.card.organisation}${CONSOLE_COLOR.white}`)
        })
   
        return log
    }

}