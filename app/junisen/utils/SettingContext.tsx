import { Context, createContext } from "react";
import LeagueSetting from "../model/LeagueSetting";

const SettingContext: Context<LeagueSetting> = createContext({
    playoff: true,
    up: 2,
    down: 2
});

export default SettingContext;
