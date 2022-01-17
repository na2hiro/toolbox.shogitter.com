import React from "react";
import {Link} from "remix";
import thumbnail from "../junisen/thumbnail.png";
import {H1} from "~/junisen/styled/heading";
import {RemixableScript} from "~/common/components/RemixableScript";

export default function Index() {
    return (
        <div className={"mx-2"}>
            <H1 className="font-serif">Shogi Toolbox!</H1>
            将棋好きのためのツール集です（予定）
            <div>
                <ul className={"flex"}>
                    <CardLink to={"/junisen"}>
                        <img src={thumbnail}/>
                        <div className={"px-4 py-2"}> 順位戦数え上げ</div>
                    </CardLink>
                    <CardLink to={""} className={"opacity-50 flex justify-center items-center"}>
                        <div className={"px-4 py-2"}>coming soon...</div>
                    </CardLink>
                </ul>
            </div>
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
        <li className={"border border-gray-200 rounded-md my-4 mx-2 sm:mx-4 lg:mx-6 w-60 shadow-lg "+(className??"")}>
            <Link to={to}>
                {children}
            </Link>
        </li>
    )
}
