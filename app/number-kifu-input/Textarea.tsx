import {FC, useEffect, useState} from "react";

export type Coord = { x: number, y?: number };

type Props = {
    onNewCoord: (coord: Coord | null) => void;
    tesuu: number;
    onChangeTesuu: (value: number) => void;
}
const Textarea: FC<Props> = ({onNewCoord, tesuu, onChangeTesuu}) => {
    const [text, setText] = useState("");
    useEffect(() => {
        interpret(text);
    }, [tesuu])

    return (
        <div className="flex">
            <textarea value={text} onChange={(e) => {
                const newText = e.target.value;
                setText(newText);
                interpret(newText);
            }} className="border border-gray-200 flex-auto" rows={5}/>
        </div>
    )

    function interpret(wholeText: string) {
        if (wholeText.length < tesuu * 2) {
            onChangeTesuu(tesuu - 1);
            return;
        }
        const text = wholeText.slice(tesuu * 2);
        if (text.length == 0) {
            onNewCoord(null)
        } else if (text.length == 1) {
            onNewCoord({x: parseInt(text)})
        } else if (text.length == 2) {
            onNewCoord({
                x: parseInt(text.charAt(0)),
                y: parseInt(text.charAt(1))
            })
        }
    }
}

export default Textarea;