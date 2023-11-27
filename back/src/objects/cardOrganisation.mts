import { ORGANISATIONS } from "../settings/gameSettings.mjs";
import Card from "./card.mjs";
import Player from "./player.mjs";

export default class CardOrganisation extends Card {

    readonly organisation: ORGANISATIONS

    constructor(organisation: ORGANISATIONS) {
        super()
        this.organisation = organisation
    }

    reset(): void {
    }


    export(forPlayer?: Player): { [k: string]: any; uuid: string } {
        return {
            organisation: this.owner !== forPlayer ? '' : this.organisation,
            ...super.export(forPlayer)
        }
    }
}