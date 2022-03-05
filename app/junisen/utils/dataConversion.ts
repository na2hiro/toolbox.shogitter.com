import Player from "~/junisen/models/Player";
import LeagueSetting from "~/junisen/models/LeagueSetting";
import Game from "../models/Game";

export function calcProps(setting: LeagueSetting, names: string[], doneGames: number[][], undoneGames: number[][]) {
    const players = names.map((n, i) => new Player(n, i));
    const done = toP(doneGames)
        .map(Game.done);
    const undone = toP(undoneGames)
        .filter(arr => arr.length == 2)
        .map(Game.undone);

    let initialDoneGames: Game[] = [];
    try {
        if (typeof location !== "undefined" && location.search) {
            const indices = queryToResults(location.search);
            initialDoneGames = toP(indices)
                .map(Game.done)
                .filter(game => undone.some(undoneGame => undoneGame.sameMatch(game)));
        }
    } catch (e) {
        console.error(e);
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

function queryToResults(search: string) {
    const searchParams = new URLSearchParams(search);
    return searchParams.getAll("done").map((s) => (
        s.split("-").map(Number)
    ))
}

export function serializeDoneGames(selectedDoneGames: Game[]) {
    return serializeDone(selectedDoneGames
        .map(g => g.serialize()));
}

export function serializeDone(selectedDone: number[][]) {
    const searchParams = new URLSearchParams();
    selectedDone
        // sort by smaller player number
        .sort((a, b) => Math.min(...a) - Math.min(...b))
        .map(g => g.join("-"))
        .forEach(result => searchParams.append("done", result));
    return searchParams.toString();
}
