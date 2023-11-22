

export default class Stats {

    private counter: {[k: string]: number} = {}

    push(type: string, label: string, value: number = 1) {
        if (!this.counter[ type + "//" + label ]) this.counter[ type + "//" + label ] = value
        else this.counter[ type + "//" + label ] += value
    }

    tidy() {
        return Object.entries(this.counter).map(n => {
            const xp = n[0].split('//')
            return {type: xp[0], label: xp[1], count: n[1]}
        }).sort((a,b) => b.type.localeCompare(a.type))
    }

}