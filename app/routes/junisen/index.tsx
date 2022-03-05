import {LoaderFunction, redirect} from "remix";
import {getClasses, getPath, getPeriods} from "~/junisen/data";

export const loader: LoaderFunction = () => {
    const latestPeriod = getPeriods()[0];
    const highestClass = getClasses(latestPeriod)[0];
    return redirect(getPath(latestPeriod, highestClass));
}
