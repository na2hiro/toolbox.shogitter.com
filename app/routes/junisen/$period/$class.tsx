import {useMemo} from "react";
import PlayerTable from "~/junisen/models/PlayerTable";
import League from "~/junisen/components/League";
import SettingContext from "~/junisen/utils/SettingContext";
import { LoaderFunction, useLoaderData } from "remix";
import {calcProps} from "~/junisen/utils/dataConversion";
import {resultData, setting} from "~/junisen/data";

import styles from "~/junisen/style.css";

export function links() {
    return [
        {
            rel: "stylesheet",
            href: styles
        }
    ];
}

export const loader: LoaderFunction = ({params}) => {
    const data = resultData[params.period!][params.class!];
    const s = setting[params.class!];
    if(!data || !s) {
        throw new Response("not found", {status: 404});
    }
    return {
        data,
        setting: s,
        pageId: params.period+"_"+params.class
    }
}

export default function JunisenIndex() {
    const {data, setting, pageId} = useLoaderData();
    const props = useMemo(() => {
        return calcProps(data.players, data.doneGames, data.undoneGames, setting);
    }, [pageId]);
    // TODO generalize year
    // TODO generalize class and support other classes
    const playerTable = useMemo(() => new PlayerTable(props.players), [pageId]);
    return (
        <SettingContext.Provider value={setting}>
            <ul>
                <li>？ボタンをクリックすると，そこが勝利である場合の順位表と数え上げを表示します．</li>
                <li>選んだ場合はURLに反映されているため，SNS等でシェアできます．</li>
            </ul>
            <League {...props} playerTable={playerTable} key={pageId}/>
            <h2>ソースコード</h2>
            <p><a href="https://github.com/na2hiro/junisen-react">na2hiro/junisen-react</a></p>
            <p>React Hooksを使って書きました</p>
        </SettingContext.Provider>
    );
}
