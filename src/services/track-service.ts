import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { InvalidValueError, RedisCounterDatabaseError, UNEXPECTED_ERROR_MESSAGE } from "../errors";
import { CounterDatabase, LoggedData, Logger } from '../infrastructure/index';
import { Utils } from './../utils';

interface RequestBody {
    [key: string]: unknown;
    count: string;
}

export interface TrackResponseData {
    message: string;
    previousCount?: number;
    count: number;
}

export interface ErrorResponseData {
    errorType: string,
    message: string;
}

export class TrackService {
    private logger;
    private counterDatabase;

    constructor(logger: Logger, counterDatabase: CounterDatabase) {
        this.logger = logger;
        this.counterDatabase = counterDatabase;
    }

    public async track(body: object, response: Response): Promise<TrackResponseData | void> {

        try {

            this.logger.logData(body);

            const currentCount = await this.counterDatabase.getCount();

            if (this.hasCount(body)) {

                if (this.validateCountValue(body.count, response)) {

                    const newCount = Number(body.count);
                    await this.counterDatabase.incrementCount(newCount);

                    const trackResponse: TrackResponseData = {
                        message: 'Count has been increased successfully',
                        previousCount: currentCount,
                        count: await this.counterDatabase.getCount()
                    }

                    return trackResponse;
                }

            }

            const trackResponse: TrackResponseData = {
                message: 'The request has been logged successfully',
                count: currentCount
            }

            return trackResponse;

        } catch (error) {
            this.handleError(error, response);
        }
    }

    private hasCount(body: object): body is RequestBody {

        return (body.hasOwnProperty('count')) ? true : false;

    }

    private validateCountValue(count: string | number, response: Response) {

        const utils = new Utils();

        if (typeof count === 'string') {

            if (utils.isStringEmpty(count)) { this.sendBadRequest(response, 'count value cannot be empty'); return false; }
            if (utils.notNumber(count)) { this.sendBadRequest(response, 'count value must be a number'); return false; }
            if (utils.isZero(count)) { this.sendBadRequest(response, 'count value cannot be zero'); return false; }

            return true;

        } else if (typeof count === 'number') {

            if (utils.isZero(count)) { this.sendBadRequest(response, 'count value cannot be zero'); return false; }

            return true;

        } else {

            this.sendBadRequest(response, 'count value is not a valid number');

            return false;

        }

    }

    sendBadRequest(response: Response, message: string): Response {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: message });
    }

    private handleError(error: unknown, response: Response) {
        if (error instanceof InvalidValueError) {
            const errorResp: ErrorResponseData = {
                errorType: InvalidValueError.name,
                message: error.message
            };

            response.status(StatusCodes.BAD_REQUEST).json(errorResp);
        }

        if (error instanceof RedisCounterDatabaseError) {
            const errorResp: ErrorResponseData = {
                errorType: RedisCounterDatabaseError.name,
                message: error.stack || UNEXPECTED_ERROR_MESSAGE
            };
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResp);
        }
    }

}
