import {
    Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration
} from "remix";
import type {MetaFunction} from "remix";
import styles from "./tailwind.css";
import { FunctionComponent } from "react";
import {getOpenGraphMetas, getTwitterMetas} from "~/common/utils/seoUtils";
import appThumbnail from "~/app-thumbnail.png";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
    const title = "Shogi Toolbox";
    const setting = {
        title, description: "将棋好きのためのツール集です（予定）", img: {
            url: appThumbnail,
            width: 375,
            height: 380
        }
    };
    return {
        title,
        viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
        ...getTwitterMetas(setting),
        ...getOpenGraphMetas(setting),
    };
};

type MenuItemProps = {
    to: string;
}
const MenuItem: FunctionComponent<MenuItemProps> = ({to, children}) => {
    return <NavLink to={to} prefetch="intent" className={({isActive})=>`flex items-center px-2 hover:bg-blue-600 ${isActive?"bg-blue-600":""}`}>{children}</NavLink>
}

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className="flex items-stretch bg-blue-700 text-white shadow-lg mb-2">
            <Link className="p-3 font-bold font-serif text-2xl shadow hover:bg-blue-600 items-center" to="/" prefetch="intent">Shogi Toolbox</Link>
            <MenuItem to="/junisen">順位戦数え上げ</MenuItem>
        </div>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        {process.env.NODE_ENV === "development" && <LiveReload/>}
        </body>
        </html>
    );
}
