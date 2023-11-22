import { v4 } from 'uuid'

export default abstract class Entity {

    readonly uuid: string

    constructor() {
        this.uuid = v4()
    }

    
    abstract reset():void

    verbose(): string[] {
        return []
    }

    shuffleArray(array: Array<any>) {
        array.sort((a: any, b: any) => 0.5 - Math.random());
    }
    
    pickRandom<T>(array: T[], removeFromArray: boolean = false): T {
        if (array.length === 0 ) throw new Error('Cannot pick, empty array')

        const index = Math.floor( Math.random() * array.length )

        if (removeFromArray) {
            const o = array.splice(index, 1)
            return o[0]
        } else {
            return array[index]
        }
    }
}