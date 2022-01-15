import React from "react";

export const H1: React.FunctionComponent = ({children, className, ...props}) => {
    return <h1 className={`text-3xl font-bold mb-3 mt-6 ${className??""}`} {...props}>{children}</h1>;
}

export const H2: React.FunctionComponent = ({children, className, ...props}) => {
    return <h1 className={`text-2xl font-bold mb-3 mt-6 ${className??""}`} {...props}>{children}</h1>;
}
