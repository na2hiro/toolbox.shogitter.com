import React from "react";
import DoneGameDispatchContext from "../utils/DoneGameDispatchContext";
import { FunctionComponent, useCallback, useContext } from "react";
import {UndoneLog} from "~/junisen/models/Log";
import Player from "~/junisen/models/Player";

type Props = {
    log: UndoneLog;
    player: Player;
    className?: string;
};
const DoneSelectButton: FunctionComponent<Props> = ({ log, player, className = "" }) => {
    const doneGameDispatch = useContext(DoneGameDispatchContext);

    let mark,
        action = "select";
    if (log.type === "undone") {
        mark = "？";
    } else if (log.win) {
        mark = "○";
        action = "unselect";
    } else {
        mark = "●";
    }
    const dispatch = useCallback(
        () =>
            doneGameDispatch({
                action,
                game: [player.order, log.enemy.order]
            }),
        [player, log]
    );
    return <button className={`border border-gray-300 rounded px-2 mx-0.5 ${className}`} onClick={dispatch}>{mark}</button>;
};
export default DoneSelectButton;
