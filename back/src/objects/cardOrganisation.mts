import Entity from "./entity.mjs";
import { ORGANISATIONS } from "./game.mjs";

export default class CardOrganisation extends Entity {

    readonly organisation: ORGANISATIONS

    constructor(organisation: ORGANISATIONS) {
        super()
        this.organisation = organisation
    }

    reset(): void {
    }

}