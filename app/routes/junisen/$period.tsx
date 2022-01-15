import {Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import {resultData} from "~/junisen/data";

type LoaderData = {classes: string[]}
export const loader: LoaderFunction = ({params}) => {
    const classes = resultData[params.period!];
    if(!classes) {
        throw new Response("not found", {status: 404});
    }
    return {
        classes: Object.keys(classes)
    };
};

export default function JunisenIndex() {
    const {classes} = useLoaderData<LoaderData>();
    return (
        <>
            <ul>
                {classes.map(clss => <li key={clss}><Link to={`${clss}`}>{clss}級</Link></li>)}
            </ul>
            <Outlet/>
        </>
    )
}
