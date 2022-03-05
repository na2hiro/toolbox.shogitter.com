import {HeadersFunction, LoaderFunction, Outlet, redirect, useLoaderData} from "remix";
import LeftRightPane from "~/junisen/styled/LeftRightPane";
import BoldNavLink from "~/junisen/styled/BoldNavLink";
import {displayClass, displayPeriod} from "~/junisen/utils/display";
import {getClasses, getPeriods} from "~/junisen/data";
import {MetaFunction, ShouldReloadFunction} from "@remix-run/react/routeModules";
import {getJunisenMetas} from "~/junisen/utils/junisenMetas";
import {serializeDone, serializeDoneGames} from "~/junisen/utils/dataConversion";

type LoaderData = { classes: string[], period: string, periods: string[], defaultResultsForClasses: ([number, number] | undefined)[] };
export const loader: LoaderFunction = ({params, request}) => {
    const period = params.period!;
    const classes = getClasses(params.period!);
    if (!classes) {
        throw new Response("not found", {status: 404});
    }
    if (request.url.endsWith(`/${period}`) && classes.length === 1) {
        throw redirect(`/junisen/${period}/${classes[0][0]}`);
    }
    return {
        period,
        periods: getPeriods(),
        classes: classes.map(([k, v]) => k),
        defaultResultsForClasses: classes.map(([k, v]) => v.defaultDoneGames),
    };
};

export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": "max-age=3600"
    }
}

export const unstable_shouldReload: ShouldReloadFunction =
    ({ params, submission, url, prevUrl }) => url.pathname !== prevUrl.pathname;

export const meta: MetaFunction = () => {
    return getJunisenMetas({
        title: "順位戦数え上げ | Shogi Toolbox"
    });
};

export default function JunisenIndex() {
    const {classes, periods, period, defaultResultsForClasses} = useLoaderData<LoaderData>();
    return (
        <LeftRightPane
            left={<>
                <ul className="grow-0 list-disc ml-6">
                    {periods.map(p => <li key={p}>
                        <BoldNavLink to={`/junisen/${p}`}>{displayPeriod(p)}</BoldNavLink>
                        {p === period && (
                            <ul className={"list-disc ml-6"}>
                                {classes.map((clss, i) => <li key={clss}><BoldNavLink
                                    to={`/junisen/${period}/${clss}${defaultResultsForClasses[i] ? "?"+serializeDone(defaultResultsForClasses[i]) : ""}`}>{displayClass(clss)}</BoldNavLink></li>)}
                            </ul>
                        )}
                    </li>)}
                </ul>
            </>}
            right={<Outlet/>}
        />
    )
}
