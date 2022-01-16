import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = () => {
    return redirect("/junisen/80/a");
}
