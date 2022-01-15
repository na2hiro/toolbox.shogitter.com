import {Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import {resultData} from "~/junisen/data";
import LeftRightPane from "~/junisen/styled/LeftRightPane";
import BoldNavLink from "~/junisen/styled/BoldNavLink";
import {displayClass, displayPeriod} from "~/junisen/utils/display";

type LoaderData = {classes: string[], period: string, periods: string[]};
export const loader: LoaderFunction = ({params}) => {
    const period = params.period!;
    const classes = resultData[params.period!];
    if(!classes) {
        throw new Response("not found", {status: 404});
    }
    return {
        period,
        periods: Object.keys(resultData),
        classes: Object.keys(classes)
    };
};

export default function JunisenIndex() {
    const {classes, periods ,period} = useLoaderData<LoaderData>();
    return (
        <LeftRightPane
            left={<>
                <ul className="grow-0 list-disc ml-8">
                    {periods.map(p => <li key={p}>
                        <BoldNavLink to={`/junisen/${p}`}>{displayPeriod(p)}</BoldNavLink>
                        {p===period && (
                            <ul className={"list-disc ml-8"}>
                                {classes.map(clss => <li key={clss}><BoldNavLink to={`/junisen/${period}/${clss}`}>{displayClass(clss)}</BoldNavLink></li>)}
                            </ul>
                        )}
                    </li>)}
                </ul>
                <div className="mt-4"><BoldNavLink to="/junisen/about">About</BoldNavLink></div>
            </>}
            right={<Outlet/>}
        />
    )
}
