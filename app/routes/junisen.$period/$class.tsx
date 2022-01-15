import {useMemo} from "react";
import PlayerTable from "~/junisen/models/PlayerTable";
import League from "~/junisen/components/League";
import SettingContext from "~/junisen/utils/SettingContext";
import { LoaderFunction, useLoaderData, useParams } from "remix";
import {calcProps} from "~/junisen/utils/dataConversion";
import {getData, setting} from "~/junisen/data";

import styles from "~/junisen/style.css";
import {displayClass, displayPeriod} from "~/junisen/utils/display";
import {H1} from "~/junisen/styled/heading";
import { MetaFunction } from "@remix-run/react/routeModules";

export function links() {
    return [
        {
            rel: "stylesheet",
            href: styles
        }
    ];
}

export const loader: LoaderFunction = ({params}) => {
    const data = getData(params.period!, params.class!);
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

export const meta: MetaFunction = () => {
    const params = useParams();
    return {
        title: `${displayPeriod(params.period!)}${displayClass(params.class!)}順位戦数え上げ | Shogi Toolbox`
    }
};
export default function JunisenIndex() {
    const params = useParams();
    const {data, setting, pageId} = useLoaderData();
    const props = useMemo(() => {
        return calcProps(data.players, data.doneGames, data.undoneGames, setting);
    }, [pageId]);
    // TODO generalize year
    // TODO generalize class and support other classes
    const playerTable = useMemo(() => new PlayerTable(props.players), [pageId]);
    return (
        <SettingContext.Provider value={setting}>
            <H1>{displayPeriod(params.period!)}{displayClass(params.class!)}順位戦数え上げ</H1>
            <ul className="list-disc ml-6">
                <li>？ボタンをクリックすると，そこが勝利である場合の順位表と数え上げを表示します．</li>
                <li>選んだ場合はURLに反映されているため，SNS等でシェアできます．</li>
            </ul>
            <League {...props} playerTable={playerTable} key={pageId}/>
        </SettingContext.Provider>
    );
}
