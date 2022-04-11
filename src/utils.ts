
export function isStringEmpty(count: string): boolean {
    return !count.length;
}

export function notNumber(count: string): boolean {
    return isNaN(parseInt(count));
}

export function isZero(count: string | number): boolean {
    return count === "0" || count === 0;
}

export function hasCount(body: object) {

    return (body.hasOwnProperty('count')) ? true : false;

}
