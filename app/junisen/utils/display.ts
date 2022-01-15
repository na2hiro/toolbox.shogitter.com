export const displayPeriod = (period: number | string): string => {
    return `第${period}期`;
};

export const displayClass = (clss: string): string => {
    switch (clss) {
        case "a":
            return "A級"
        case "b1":
            return "B級1組"
        case "b2":
            return "B級2組"
        case "c1":
            return "C級1組"
        case "c2":
            return "C級2組"
        default:
            throw new Error("unknown class");
    }
};
