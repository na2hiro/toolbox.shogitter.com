import {useEffect, useRef, VFC} from "react";

type Props = {
    src: string;
}
export const RemixableScript: VFC<Props> = ({src}) => {
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        ref.current?.appendChild((() => {
            const script = document.createElement("script");
            script.src = src;
            return script;
        })());
        return () => {
            ref.current?.firstChild?.remove();
        }
    }, [ref.current]);
    return (
        <span ref={ref}/>
    )
}
