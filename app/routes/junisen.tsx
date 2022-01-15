import {Link, LoaderFunction, Outlet, useLoaderData} from "remix";
import {resultData} from "~/junisen/data";

type LoaderData = {periods: string[]}
export const loader: LoaderFunction = () => {
    const periods = Object.keys(resultData)

    return {
        periods
    };
};

export default function JunisenIndex() {
    const {periods} = useLoaderData<LoaderData>();
    return (
        <>
            <h2>順位戦数え上げ</h2>

            <ul>
                {periods.map(period => <li key={period}><Link to={period}>第{period}期</Link></li>)}
            </ul>
            <Outlet/>
        </>
    )
}
