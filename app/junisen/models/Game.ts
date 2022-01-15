import Log from "./Log";
import Player from "./Player";

export default class Game {
    public static tempDone(players: Player[]): Game {
        const game = new Game(players, false);
        game.tempWin(players[0]);
        return game;
    }

    public static done(players: Player[]): Game {
        if (players.length == 1) {
            return new NullGame(players);
        } else {
            return new Game(players, true);
        }
    }

    public static undone(players: Player[]): Game {
        return new Game(players, false);
    }

    public temp: Player | null;
    constructor(public players: Player[], public result = false) {}

    public getLog(player: Player): Log {
        const enemy = this.players[0] == player ? this.players[1] : this.players[0];
        if (this.result) {
            return { type: "done", enemy, win: this.players[0] == player };
        } else if (this.temp != null) {
            return { type: "temp", enemy, win: this.temp == player, temp: true };
        } else {
            return { type: "undone", enemy };
        }
    }

    public tempWin(player: Player) {
        this.temp = player;
    }

    public tempWinBack() {
        this.temp = null;
    }

    public sameMatch(game: Game) {
        const [this1, this2] = this.players.map(player => player.order).sort();
        const [that1, that2] = game.players.map(player => player.order).sort();
        return this1 == that1 && this2 == that2;
    }

    public serialize(): number[] {
        return [this.players[0].order, this.players[1].order];
    }
}
export class NullGame extends Game {
    public getLog(): Log {
        return { type: "empty" };
    }
}
