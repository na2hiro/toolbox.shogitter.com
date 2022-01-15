import React, { FunctionComponent, useCallback, useContext, useMemo, useState } from "react";

import SettingContext from "../utils/SettingContext";
import DoneSelectButton from "./DoneSelectButton";
import Game from "~/junisen/models/Game";
import PlayerTableModel from "~/junisen/models/PlayerTable";
import Player from "~/junisen/models/Player";
import League from "~/junisen/models/League";

interface Props {
    model: PlayerTableModel;
    games: { [name: string]: Game[] };
}

const PlayerTable: FunctionComponent<Props> = ({ model, games }) => {
    const kaisenThs = useMemo(
        () => games[model.players[0].name].map((_, i) => <th key={i}>{i + 1}回戦</th>),
        []
    );

    const [sort, setSort] = useState("order");
    const setSortByOrder = useCallback(() => setSort("order"), []);
    const setSortByRank = useCallback(() => setSort("rank"), []);

    const sortedPlayers = model.players
        .slice()
        .sort(sort == "order" ? (p1, p2) => p1.order - p2.order : (p1, p2) => p1.rank - p2.rank);

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        昨順
                        <button onClick={setSortByOrder}>{sort == "order" ? "▲" : "△"}</button>
                    </th>
                    <th>棋士</th>
                    <th>勝敗</th>
                    <th>
                        順<button onClick={setSortByRank}>{sort == "rank" ? "▲" : "△"}</button>
                    </th>
                    <th>確</th>
                    {useContext(SettingContext).playoff ? (
                        <>
                            <th>挑</th>
                            <th>プ</th>
                        </>
                    ) : (
                        <th>昇</th>
                    )}
                    <th>降</th>
                    {kaisenThs}
                </tr>
            </thead>
            <tbody>
                {sortedPlayers.map(player => (
                    <PlayerTableRow player={player} games={games[player.name]} key={player.order} />
                ))}
            </tbody>
        </table>
    );
};
export default PlayerTable;

interface RowProps {
    player: Player;
    games: Game[];
}

const PlayerTableRow: FunctionComponent<RowProps> = ({ player, games }) => {
    const setting = useContext(SettingContext);
    let mark = "";
    let className;
    if (player.countChallenge == player.numCombinations) {
        className = "bg-red-400";
        mark = setting.playoff ? "挑" : "昇";
    } else if (player.countPlayoff == player.numCombinations) {
        className = "bg-red-200";
        mark = "プ";
    } else if (player.countDown == player.numCombinations) {
        className = "bg-blue-400";
        mark = "降";
    }
    return (
        <tr className={className}>
            <td>{player.order + 1}</td>
            <td>{player.name}</td>
            <td>{`${player.win}-${player.lose}`}</td>
            <td>{player.rank + 1}</td>
            <td>{mark}</td>
            <td className="text-right">{player.countChallenge}</td>
            {setting.playoff && <td className="text-right">{player.countPlayoff}</td>}
            <td className="text-right">{player.countDown}</td>
            {games.map((game, i) => (
                <PlayerTableCell game={game} player={player} key={i} />
            ))}
        </tr>
    );
};

interface CellProps {
    game: Game;
    player: Player;
}

const PlayerTableCell: FunctionComponent<CellProps> = ({ game, player }) => {
    const log = game.getLog(player);
    if (log.type === "empty") {
        return <td />;
    } else if (log.type === "done") {
        return (
            <td>
                {typeof log.win === "undefined" ? "　" : League.getWinMark(log.win)}
                <span className="text-sm">{log.enemy.abbrev}</span>
            </td>
        );
    } else {
        return (
            <td>
                <DoneSelectButton log={log} player={player} />
                <span className="text-sm">{log.enemy.abbrev}</span>
            </td>
        );
    }
};
