import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer
} from "react";
import queryString from "query-string";

import DoneGameDispatchContext from "../utils/DoneGameDispatchContext";
import SettingContext from "../utils/SettingContext";
import CombinationTable from "./CombinationTable";
import PlayerTable from "./PlayerTable";
import DoneSelectButton from "./DoneSelectButton";
import Game from "~/junisen/models/Game";
import LeagueModel from "~/junisen/models/League";
import PlayerTableModel from "~/junisen/models/PlayerTable";
import {UndoneLog} from "~/junisen/models/Log";
import { H2 } from "../styled/heading";

// TODO: don't SSR as it can be too big
interface Props {
    playerTable: PlayerTableModel;
    doneGames: Game[];
    undoneGames: Game[];
    initialDoneGames: Game[];
}
const League: FunctionComponent<Props> = React.memo(
    ({ playerTable, doneGames, undoneGames, initialDoneGames }) => {
        const setting = useContext(SettingContext);
        const [selectedDoneGames, dispatchDoneGames] = useReducer(
            (selectedDoneGames: Game[], action: { action: string; game?: number[] }) => {
                const newImaginaryGame = Game.done(
                    (action.game || []).map(player => playerTable.players[player])
                );
                switch (action.action) {
                    case "select":
                        return selectedDoneGames
                            .filter(game => !game.sameMatch(newImaginaryGame))
                            .concat([newImaginaryGame]);
                    case "unselect":
                        return selectedDoneGames.filter(game => !game.sameMatch(newImaginaryGame));
                    case "clear":
                        return [];
                    default:
                        throw new Error("unknown action");
                }
            },
            initialDoneGames
        );
        useEffect(() => {
            const newHash = queryString.stringify({
                done: JSON.stringify(selectedDoneGames.map(g => g.serialize()))
            });
            try {
                history.replaceState("", document.title, window.location.pathname + "#" + newHash);
            } catch (e) {
                location.hash = newHash;
            }
        });
        const modelInstance = useMemo(() => {
            const model = new LeagueModel(playerTable, setting);
            doneGames.forEach(game => model.add(game));
            undoneGames.forEach(game => model.add(game));

            return model;
        }, []);
        const model = useMemo(() => {
            const model = modelInstance;
            model.setImaginary(selectedDoneGames);
            model.search();
            return model;
        }, [selectedDoneGames]);
        const onClickClear = useCallback(() => {
            dispatchDoneGames({ action: "clear" });
        }, []);

        return (
            <DoneGameDispatchContext.Provider value={dispatchDoneGames}>
                <H2>
                    残りの対局
                </H2>
                <button className="border-gray-300 border rounded-sm px-1" onClick={onClickClear}>クリア</button>
                <UndoneGames undoneGames={undoneGames} />
                <H2>順位表</H2>
                {LeagueModel.settingToString(setting)}{" "}
                <button className="border-gray-300 border rounded-sm px-1 m-0.5" onClick={onClickClear}>クリア</button>
                <PlayerTable model={playerTable} games={model.map} combination={model.searched} />
                <H2>結果数え上げ</H2>
                <p>マスの中：勝-敗 星 順位</p>
                <CombinationTable combination={model.searched} players={playerTable.players} />
            </DoneGameDispatchContext.Provider>
        );
    }
);

export default League;

type UndoneGamesProps = {
    undoneGames: Game[];
};
const UndoneGames: FunctionComponent<UndoneGamesProps> = ({ undoneGames }) => {
    return (
        <ul className="flex flex-wrap">
            {undoneGames.map(game => (
                <li key={game.players.map(p=>p.rank).join(",")} className="border border-gray-100 flex flex-col p-3 m-2 rounded-md shadow-md">
                    {`${game.players[0].name} (${game.players[0].order + 1}) `}
                    <DoneSelectButton
                        player={game.players[0]}
                        log={game.getLog(game.players[0]) as UndoneLog}
                    />
                    <DoneSelectButton
                        player={game.players[1]}
                        log={game.getLog(game.players[1]) as UndoneLog}
                    />
                    {` ${game.players[1].name} (${game.players[1].order + 1})`}
                </li>
            ))}
        </ul>
    );
};
