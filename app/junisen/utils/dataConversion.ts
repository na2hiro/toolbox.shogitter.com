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
        if (typeof location !== "undefined" && location.hash) {
            const indices = hashValueToResults(location.hash);
            initialDoneGames = toP(indices)
                .map(Game.done)
                .filter(game => undone.some(undoneGame => undoneGame.sameMatch(game)));
        }
    } catch (e) {
        // ignore
        if (typeof location !== "undefined") {
            location.hash = "";
        }
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

function hashValueToResults(hashValue: string) {
    return (hashValue ?? "")
        .substring(2)
        .split("__")
        .filter(d => d !== "")
        .map((d) => d
            .split("_")
            .filter(v => v !== "")
            .map((n) => parseInt(n)));
}

export function serializeDoneGames(selectedDoneGames: Game[]) {
    if(selectedDoneGames.length == 0) {
        return null;
    }
    const v = selectedDoneGames.map(g => g.serialize().join("_")).join("__")
    return "d" + v;
}
