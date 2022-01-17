import {LoaderFunction, Outlet, redirect, useLoaderData} from "remix";
import LeftRightPane from "~/junisen/styled/LeftRightPane";
import BoldNavLink from "~/junisen/styled/BoldNavLink";
import {displayClass, displayPeriod} from "~/junisen/utils/display";
import {getClasses, getPeriods} from "~/junisen/data";
import {MetaFunction} from "@remix-run/react/routeModules";
import {getJunisenMetas} from "~/junisen/utils/junisenMetas";

type LoaderData = { classes: string[], period: string, periods: string[] };
export const loader: LoaderFunction = ({params, request}) => {
    const period = params.period!;
    const classes = getClasses(params.period!);
    if (!classes) {
        throw new Response("not found", {status: 404});
    }
    if (request.url.endsWith(`/${period}`) && classes.length === 1) {
        throw redirect(`/junisen/${period}/${classes[0]}`);
    }
    return {
        period,
        periods: getPeriods(),
        classes
    };
};

export const meta: MetaFunction = () => {
    return getJunisenMetas({
        title: "順位戦数え上げ | Shogi Toolbox"
    });
};

export default function JunisenIndex() {
    const {classes, periods, period} = useLoaderData<LoaderData>();
    return (
        <LeftRightPane
            left={<>
                <ul className="grow-0 list-disc ml-6">
                    {periods.map(p => <li key={p}>
                        <BoldNavLink to={`/junisen/${p}`}>{displayPeriod(p)}</BoldNavLink>
                        {p === period && (
                            <ul className={"list-disc ml-6"}>
                                {classes.map(clss => <li key={clss}><BoldNavLink
                                    to={`/junisen/${period}/${clss}`}>{displayClass(clss)}</BoldNavLink></li>)}
                            </ul>
                        )}
                    </li>)}
                </ul>
            </>}
            right={<Outlet/>}
        />
    )
}
