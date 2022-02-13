import {useState } from "react";
import Textarea, {Coord} from "~/number-kifu-input/Textarea";
import Shogi from "~/number-kifu-input/Shogi";
import {H1} from "~/junisen/styled/heading";
import { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
    return {
        title: "数字棋譜入力 | Shogi Toolbox",
    }
}

export default function NumberKifuInput() {
    const [newCoord, onNewCoord] = useState<Coord | null>(null);
    const [tesuu, onChangeTesuu] = useState(0);
    return <div className="m-2">
        <H1>数字棋譜入力 (experimental)</H1>
        <p>行き先の符号を入れると動かせます。（例: 763426）一意に定まらない場合などに対応していません。</p>
        <Textarea {...{onNewCoord, tesuu, onChangeTesuu}} />
        <Shogi {...{newCoord, tesuu, onChangeTesuu}} />
    </div>;
}

