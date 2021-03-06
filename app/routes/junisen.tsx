import {MetaFunction} from "@remix-run/react/routeModules";
import {Link, LoaderFunction, Outlet, useLoaderData} from "remix";
import LeftRightPane from "~/junisen/styled/LeftRightPane";
import BoldNavLink from "~/junisen/styled/BoldNavLink";
import {displayPeriod} from "~/junisen/utils/display";
import {getPeriods} from "~/junisen/data";
import {getJunisenMetas} from "~/junisen/utils/junisenMetas";

export const meta: MetaFunction = () => {
    return getJunisenMetas({
        title: "順位戦数え上げ | Shogi Toolbox",
    });
};

type LoaderData = { periods: string[] }
export const loader: LoaderFunction = () => {
    const periods = getPeriods();

    return {
        periods
    };
};

export default function JunisenIndex() {
    const {periods} = useLoaderData<LoaderData>();
    return (
        <LeftRightPane
            left={<>
                <ul className="grow-0 list-disc ml-6">
                    {periods.map(p => <li key={p}><BoldNavLink to={p}>{displayPeriod(p)}</BoldNavLink></li>)}
                </ul>
            </>}
            right={<Outlet/>}
        />
    )
}
