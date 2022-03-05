export default class Player {
    public win = 0;
    public lose = 0;
    public rank?: number;
    public challenge?: boolean;
    public playoff?: boolean;
    public down?: boolean;
    public countChallenge = 0;
    public countPlayoff = 0;
    public countDown = 0;
    public abbrev: string;
    public numCombinations = -1;

    constructor(public name: string, public order: number) {}

    public reset() {
        this.countDown = this.countChallenge = this.countPlayoff = 0;

        this.rank = undefined;
    }

    public resetFlags() {
        this.down = this.challenge = this.playoff = false;
    }
}
