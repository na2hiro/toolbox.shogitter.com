import Player from "~/junisen/models/Player";
import LeagueSetting from "~/junisen/models/LeagueSetting";
import Game from "../models/Game";

export function calcProps(names: string[], doneGames: number[][], undoneGames: number[][], setting: LeagueSetting) {
    const players = names.map(function (n) {
        return new Player(n);
    });
    const done = toP(doneGames)
        .map(Game.done);
    const undone = toP(undoneGames)
        .filter(arr => arr.length == 2)
        .map(Game.undone);

    let initialDoneGames: Game[] = [];
    try {
        /*const hash = queryString.parse(location.hash);
        if (typeof hash.done === "string") {
            initialDoneGames = toP(JSON.parse(hash.done))
                .map(Game.done)
                .filter(game => undone.some(undoneGame => undoneGame.sameMatch(game)));
        }*/
    } catch (e) {
        // ignore
        location.hash = "";
    }

    function toP(indices: number[][]) {
        return indices.map(function (g) {
            return g.map(function (pn) {
                return players[pn];
            });
        });
    }

    return {players, setting, doneGames: done, undoneGames: undone, initialDoneGames};
}
