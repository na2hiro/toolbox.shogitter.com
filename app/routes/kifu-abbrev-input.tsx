import {useState} from "react";
import svg1 from "../kifu-abbrev-input/1.svg";
import svg2 from "../kifu-abbrev-input/2.svg";
import {H1, H2} from "~/junisen/styled/heading";

const kinds: { [kind: string]: string } = {
    "FU": "歩",
    "KY": "香",
    "KE": "桂",
    "GI": "銀",
    "KI": "金",
    "KA": "角",
    "HI": "飛",
    "OU": "玉",
    "TO": "と",
    "NY": "成香",
    "NK": "成桂",
    "NG": "成銀",
    "UM": "馬",
    "RY": "竜",
};
const abbrev = (kind: string) => {
    kinds[kind.charAt(0)] = kinds[kind];
}
["FU", "GI", "HI", "OU", "TO", "UM", "RY"].forEach(abbrev);

/**
 * Convert all the abbreviations to proper kifu format within free text
 * Refer https://www.shogi.or.jp/faq/kihuhyouki.html
 * @param input
 */
function convert(input: string): string {
    let isBlack = true;
    return input.replace(
        /(\\?)(([1-9１-９])([1-9１-９])(x?)|(x))(FU?|KY|KE|GI?|KI|KA|HI?|OU?|TO?|NY|NK|NG|UM?|RY?)(([lrc]?)([ayh]?)([n+-]?)(d?)) ?/gi,
        (match: string, flip: string, _: string, x: string, y: string, same1: string, same2: string, kind: string,
         _2: string, lr: string, ayh: string, promote: string, da: string) => {
            if (!flip) isBlack = !isBlack;
            return (isBlack ? "☖" : "☗") +
                (x ? ("１２３４５６７８９"[+zenkaku2hankaku(x) - 1] + "一二三四五六七八九"[+zenkaku2hankaku(y) - 1]) : "") +
                (same1 || same2 ? "同" : "") +
                kinds[kind.toUpperCase()] +
                formatLrmhc(lr) +
                formatAyh(ayh) +
                formatPromote(promote) +
                (da ? "打" : "");
        });
}

function formatLrmhc(str: string): string {
    switch (str.toLowerCase()) {
        case "l":
            return "左";
        case "r":
            return "右";
        case "c":
            return "直";
        default:
            return "";
    }
}

function formatAyh(str: string): string {
    switch (str.toLowerCase()) {
        case "a":
            return "上";
        case "y":
            return "寄";
        case "h":
            return "引";
        default:
            return "";
    }
}

function formatPromote(str: string): string {
    switch (str.toLowerCase()) {
        case "n":
        case "+":
            return "成";
        case "-":
            return "不成";
        default:
            return "";
    }
}

function zenkaku2hankaku(str: string): string {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

export default function KifuAbbrevInput() {
    const [text, setText] = useState(`例：76f 34f 22ka+ xh 65ka 52kil 83ka+で先手優勢。
22xhでは\\xgが優った。`)
    return (
        <div className="m-2">
            <H1>棋譜略記入力(仮)</H1>
            <div className="flex h-52 flex-col sm:flex-row">
                <textarea autoFocus className="flex-1 border-gray-500 border-solid border p-1 shadow-md rounded-t sm:rounded-l sm:rounded-r-none -mb-[1px] sm:mb-0 sm:-mr-[1px]" value={text} onInput={(e)=>{
                    setText(e.target.value);
                }}/>
                <textarea className="flex-1 whitespace-pre-wrap border-gray-500 border-solid border p-1 shadow-md rounded-b sm:rounded-r sm:rounded-l-none" readOnly value={convert(text)}/>
            </div>
            <H2>使い方</H2>
            <p>棋譜ってこんな感じですよね：</p>
            <img src={svg1}/>
            <p>代わりにこんな感じで打ってみて下さい(厳密にこの文法通りに解釈されるわけではありません)：</p>
            <img src={svg2}/>
            <p>
                ☗☖は自動的に付きます。指し手の直前に\を入れることで反転できます。
            </p>
        </div>
    )
}