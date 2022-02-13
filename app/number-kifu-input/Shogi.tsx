import React, {FC, useMemo} from "react";
import {JKFPlayer} from "json-kifu-format";
import {Shogi as ShogiJS, IMove} from "shogi.js";

// TODO go back
// TODO deal with fork
// TODO deal with promotion
// TODO deal with put

type Props = {
    newCoord: Coord | null;
    tesuu: number;
    onChangeTesuu: (tesuu: number) => void;
}

const Shogi: FC<Props> = ({newCoord, tesuu, onChangeTesuu}) => {
    const jkf: JKFPlayer = useMemo(() => {
        return new JKFPlayer({header: {}, moves: [{}]});
    }, []);
    useMemo(() => {
        jkf.goto(tesuu);
    }, [tesuu]);

    const moves = getAllMoves(jkf.shogi)
        .filter(move => matchesNewCoord(newCoord, move.to))

    if (newCoord && newCoord.y && moves.length == 1) {
        jkf.inputMove(moves[0]);
        setTimeout(() => {
            onChangeTesuu(jkf.tesuu);
        })
    }

    return <div className="flex">
        <div className="flex">
            <ul className={"list-disc ml-6 w-60"}>
                {moves
                    .map((move, i) => {
                        return <li key={i}>{move.color} {displayCoord(move.from)} <b>{displayCoord(move.to)}</b> {move.kind}</li>
                    })
                }
            </ul>
        </div>
        <div className="flex-col">
            <pre>{jkf.shogi.toCSAString()}</pre>
            <ul className={"list-disc ml-6"}>
                {jkf.kifu.moves.slice(1).map(move => <li key={JSON.stringify(move.move)}>{JKFPlayer.moveToReadableKifu(move)}</li>)}
            </ul>
        </div>
    </div>;
}

function getAllMoves(shogi: ShogiJS): IMove[] {
    let moves: IMove[] = [];
    for (let x = 1; x <= 9; x++) {
        for (let y = 1; y <= 9; y++) {
            const from = shogi.get(x, y);
            if (from && from.color == shogi.turn) {
                moves = moves.concat(shogi.getMovesFrom(x, y));
            }
        }
    }

    // TODO put koma
    return moves;
}

interface Coord {
    x: number;
    y?: number;
}

function displayCoord(coord: Coord) {
    return "" + coord.x + coord.y;
}

function matchesNewCoord(newCoord: Coord | null, coord: Coord) {
    if (!newCoord) {
        return true
    } else if (newCoord.y) {
        return newCoord.x === coord.x && newCoord.y === coord.y;
    } else {
        return newCoord.x === coord.x;
    }
}

export default Shogi;