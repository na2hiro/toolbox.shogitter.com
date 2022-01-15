import {MetaFunction} from "@remix-run/react/routeModules";
import {Link, LoaderFunction, Outlet, useLoaderData} from "remix";
import {resultData} from "~/junisen/data";
import LeftRightPane from "~/junisen/styled/LeftRightPane";
import BoldNavLink from "~/junisen/styled/BoldNavLink";
import {displayPeriod} from "~/junisen/utils/display";

export const meta: MetaFunction = () => {
    return {
        title: "順位戦数え上げ | Shogi Toolbox"
    }
};

type LoaderData = { periods: string[] }
export const loader: LoaderFunction = () => {
    const periods = Object.keys(resultData)

    return {
        periods
    };
};

export default function JunisenIndex() {
    const {periods} = useLoaderData<LoaderData>();
    return (
        <LeftRightPane
            left={<>
                <ul className="grow-0 list-disc ml-8">
                    {periods.map(p => <li key={p}><BoldNavLink to={p}>{displayPeriod(p)}</BoldNavLink></li>)}
                </ul>
                <div className="mt-4"><BoldNavLink to="/junisen/about">About</BoldNavLink></div>
            </>}
            right={<Outlet />}
        />
    )
}
