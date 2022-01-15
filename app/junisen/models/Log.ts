import Player from "./Player";

export type UndoneLog =
    | {
          enemy: Player;
          type: "temp";
          win: boolean;
          temp: true;
      }
    | {
          enemy: Player;
          type: "undone";
      };

type Log =
    | UndoneLog
    | {
          enemy: Player;
          type: "done";
          win: boolean;
      }
    | {
          type: "empty";
      };
export default Log;
