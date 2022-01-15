import Game, { NullGame } from "./Game";
import LeagueSetting from "./LeagueSetting";
import PlayerTable from "./PlayerTable";
import Player from "./Player";

type Possibility = {
    players: PlayerResult[];
    games: any[];
};

export type PlayerResult = {
    win: number;
    lose: number;
    playoff: boolean;
    challenge: boolean;
    down: boolean;
    rank: number;
    result: Array<boolean | null>; // TODO
};

export default class League {
    public static getWinMark(win: boolean) {
        return win ? "○" : "●";
    }

    public static settingToString(setting: LeagueSetting) {
        return (
            (setting.playoff ? "挑戦1名(プレーオフあり)" : "昇級" + setting.up + "名") +
            " 降級" +
            (setting.ten ? "点" : "") +
            setting.down +
            "名"
        );
    }

    public static tempWin(game: Game) {
        game.players[0].win++;
        game.players[1].lose++;
        game.tempWin(game.players[0]);
    }

    public static tempWinBack(game: Game) {
        game.players[0].win--;
        game.players[1].lose--;
        game.tempWinBack();
    }

    public static tempLose(game: Game) {
        game.players[0].lose++;
        game.players[1].win++;
        game.tempWin(game.players[1]);
    }

    public static tempLoseBack(game: Game) {
        game.players[0].lose--;
        game.players[1].win--;
        game.tempWinBack();
    }

    public map: { [name: string]: Game[] } = {};
    public games: Game[] = [];
    public imaginaryGames: Game[] = [];

    public searched?: Array<{ players: any[]; games: any[] }>;

    constructor(private playerTable: PlayerTable, private setting: LeagueSetting) {
        playerTable.writeOrder();
        playerTable.players.forEach(player => {
            this.map[player.name] = [];
        });
    }

    public add(game: Game) {
        this.games.push(game);
        for (let i = 0; i < game.players.length; i++) {
            this.map[game.players[i].name].push(game);
        }
        if (game.result) {
            game.players[0].win++;
            game.players[1].lose++;
        }
    }

    public setImaginary(games: Game[]) {
        this.imaginaryGames.forEach(game => {
            this.games.forEach(g => {
                if (!g.result) {
                    if (g.players[0] == game.players[0] && g.players[1] == game.players[1]) {
                        League.tempWinBack(g);
                    } else if (g.players[0] == game.players[1] && g.players[1] == game.players[0]) {
                        League.tempLoseBack(g);
                    }
                }
            });
        });
        this.imaginaryGames = games;
        this.imaginaryGames.forEach(game => {
            this.games.forEach(g => {
                if (!g.result) {
                    if (g.players[0] == game.players[0] && g.players[1] == game.players[1]) {
                        League.tempWin(g);
                    } else if (g.players[0] == game.players[1] && g.players[1] == game.players[0]) {
                        League.tempLose(g);
                    }
                }
            });
        });
    }

    public rankPlayers(): Player[] {
        const comparing = <T>(keyExtractor: (value: T) => number) => (v1: T, v2: T) =>
            keyExtractor(v1) - keyExtractor(v2);
        const not = <T>(comparator: (v1: T, v2: T) => number) => (v2: T, v1: T) =>
            comparator(v1, v2);
        const chain = <T>(...comparators: Array<(v1: T, v2: T) => number>) => (v1: T, v2: T) => {
            for (let i = 0; i < comparators.length; i++) {
                const comparison = comparators[i](v1, v2);
                if (comparison != 0) return comparison;
            }
            return 0;
        };

        const players = this.playerTable.players.slice(0);
        players.forEach(player => {
            player.resetFlags();
        });
        players.sort(
            chain(not(comparing(p => p.win)), comparing(p => p.lose), comparing(p => p.order))
        );
        players.forEach((player, num) => {
            player.rank = num;
        });
        return players;
    }

    public rankAndLogPlayers(games: Game[]): Possibility {
        const players = this.rankPlayers();
        if (this.setting.playoff) {
            // assume only 1 can challenge
            let flagPlayoff = false;
            for (let i = 1; i < players.length; i++) {
                if (players[0].win != players[i].win) {
                    break;
                }
                flagPlayoff = true;
                players[i].playoff = true;
                players[i].countPlayoff++;
            }
            if (flagPlayoff) {
                players[0].playoff = true;
                players[0].countPlayoff++;
            } else {
                players[0].challenge = true;
                players[0].countChallenge++;
            }
        } else {
            for (let i = 0; i < players.length && i < this.setting.up; i++) {
                players[i].challenge = true;
                players[i].countChallenge++;
            }
        }

        for (let i = 0; i < players.length && i < this.setting.down; i++) {
            players[players.length - 1 - i].down = true;
            players[players.length - 1 - i].countDown++;
        }

        const ret: Possibility = { players: [], games: [] };
        for (let i = 0; i < this.playerTable.players.length; i++) {
            const player = this.playerTable.players[i];
            ret.players.push({
                win: player.win,
                lose: player.lose,
                playoff: player.playoff,
                challenge: player.challenge,
                down: player.down,
                rank: player.rank,
                result: this.map[player.name]
                    .map(game => {
                        const log = game.getLog(player);
                        if (log === null || log.type !== "temp") {
                            return null;
                        }
                        return log.win;
                    })
                    .filter(n => typeof n === "boolean")
            });
        }
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            ret.games.push({
                win: game.temp == game.players[0] ? game.players[0].order : game.players[1].order,
                lose: game.temp == game.players[0] ? game.players[1].order : game.players[0].order
            });
        }
        return ret;
    }

    public search() {
        this.searched = [];
        this.playerTable.players.forEach(player => {
            player.resetCounts();
        });
        const remainingGames = this.games.filter(
            game =>
                !game.result &&
                !(game instanceof NullGame) &&
                !this.imaginaryGames.some(imaginary => imaginary.sameMatch(game))
        );
        this.searchAndRank(remainingGames, 0);
        const numCombinations = Math.pow(2, remainingGames.length);
        this.playerTable.players.forEach(player => {
            player.numCombinations = numCombinations;
        });
    }

    public searchAndRank(remainingGames: Game[], i: number) {
        if (remainingGames.length <= i) {
            const ranks = this.rankAndLogPlayers(remainingGames);
            this.searched.push(ranks);
            return;
        }
        const game = remainingGames[i];
        League.tempWin(game);
        this.searchAndRank(remainingGames, i + 1);
        League.tempWinBack(game);
        League.tempLose(game);
        this.searchAndRank(remainingGames, i + 1);
        League.tempLoseBack(game);
        this.rankPlayers();
    }
}
