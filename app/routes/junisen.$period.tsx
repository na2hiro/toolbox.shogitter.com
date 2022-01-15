import {Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import LeftRightPane from "~/junisen/styled/LeftRightPane";
import BoldNavLink from "~/junisen/styled/BoldNavLink";
import {displayClass, displayPeriod} from "~/junisen/utils/display";
import {getClasses, getPeriods} from "~/junisen/data";

type LoaderData = {classes: string[], period: string, periods: string[]};
export const loader: LoaderFunction = ({params}) => {
    const period = params.period!;
    const classes = getClasses(params.period!);
    if(!classes) {
        throw new Response("not found", {status: 404});
    }
    return {
        period,
        periods: getPeriods(),
        classes
    };
};

export default function JunisenIndex() {
    const {classes, periods ,period} = useLoaderData<LoaderData>();
    return (
        <LeftRightPane
            left={<>
                <ul className="grow-0 list-disc ml-6">
                    {periods.map(p => <li key={p}>
                        <BoldNavLink to={`/junisen/${p}`}>{displayPeriod(p)}</BoldNavLink>
                        {p===period && (
                            <ul className={"list-disc ml-6"}>
                                {classes.map(clss => <li key={clss}><BoldNavLink to={`/junisen/${period}/${clss}`}>{displayClass(clss)}</BoldNavLink></li>)}
                            </ul>
                        )}
                    </li>)}
                </ul>
            </>}
            right={<Outlet/>}
        />
    )
}