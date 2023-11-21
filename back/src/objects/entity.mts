import { v4 } from 'uuid'

export default abstract class Entity {

    readonly uuid: string

    constructor() {
        this.uuid = v4()
    }

    
    abstract reset():void

    shuffleArray(array: Array<any>) {
        array.sort((a: any, b: any) => 0.5 - Math.random());
    }
}