import {ReactElement, VFC} from "react";

type Props = { left: ReactElement, right: ReactElement };
const LeftRightPane: VFC<Props> = ({left, right}) => {
    return (
        <div className="flex">
            <div className={"flex-shrink-0"}>
                <div className={"mx-2 sticky top-2 overflow-x-hidden overflow-y-auto"}>
                    {left}
                </div>
            </div>
            <div className={"mx-2 mb-8 flex-grow h-full"}>
                {right}
            </div>
        </div>
    )
}

export default LeftRightPane;
