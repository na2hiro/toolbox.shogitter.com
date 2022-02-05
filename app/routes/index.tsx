import React from "react";
import {Link} from "remix";
import thumbnailJunisen from "../junisen/thumbnail.png";
import thumbnailKifuAbbrevInput from "../kifu-abbrev-input/thumbnail.png";
import {H1} from "~/junisen/styled/heading";
import {RemixableScript} from "~/common/components/RemixableScript";

export default function Index() {
    return (
        <div className={"mx-2"}>
            <H1 className="font-serif">Shogi Toolbox!</H1>
            将棋好きのためのツール集です（予定）
                <ul className={"grid gap-5 auto-rows-fr my-4 justify-center md:justify-start"} style={{gridTemplateColumns: "repeat(auto-fit, 240px)"}}>
                    <CardLink to={"/junisen"}>
                        <img src={thumbnailJunisen}/>
                        <div className={"px-4 py-2"}> 順位戦数え上げ</div>
                    </CardLink>
                    <CardLink to={"/kifu-abbrev-input"}>
                        <img src={thumbnailKifuAbbrevInput}/>
                        <div className={"px-4 py-2"}> 棋譜略記入力</div>
                    </CardLink>
                    <CardLink to={""} className={"opacity-50 inline-flex justify-center items-center"}>
                        <div className={"px-4 py-2"}>coming soon...</div>
                    </CardLink>
                </ul>
            <H1>作者</H1>
            <a href="https://twitter.com/na2hiro?ref_src=twsrc%5Etfw" className="twitter-follow-button"
               data-size="large" data-show-count="false">Follow @na2hiro</a>
            <RemixableScript src="https://platform.twitter.com/widgets.js"/>
        </div>
    );
}

type CardLinkProps = {
    to: string;
    className?: string;
}
const CardLink: React.FC<CardLinkProps> = ({children, to, className}) => {
    return (
        <li className={"inline-block min-w-[100px] border border-gray-200 rounded-md sm:mx-4 lg:mx-6 w-60 shadow-lg "+(className??"")}>
            <Link to={to} prefetch="intent">
                {children}
            </Link>
        </li>
    )
}
