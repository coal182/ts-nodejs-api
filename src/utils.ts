import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Utils {

    constructor() {}

    isStringEmpty(count: string): boolean {
        return !count.length;
    }

    notNumber(count: string): boolean {
        return isNaN(parseInt(count));
    }

    isZero(count: string | number): boolean {
        return count === "0" || count === 0;
    }

}