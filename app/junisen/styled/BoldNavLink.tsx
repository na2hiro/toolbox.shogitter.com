import { NavLink } from "remix";
import React from "react";

const BoldNavLink: React.FC<{to: string}> = ({to, children}) => {
    return <NavLink to={to} className={({isActive}) => isActive ? "font-bold" : ""}>{children}</NavLink>
}

export default BoldNavLink;
