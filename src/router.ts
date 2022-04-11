import { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorResponseData, InvalidValueError, RedisCounterDatabaseError, ServiceConnectionError, UNEXPECTED_ERROR_MESSAGE } from "./errors";
import { JsonLogger,RedisConfig,RedisCounterDatabase } from './infrastructure/index';
import { isBodyEmpty } from './middleware/body-validator';
import { CountService,TrackService } from './services/index';

const loggerDestination = process.env.LOGGER_DESTINATION || 'log-data.json';
const logger = new JsonLogger(loggerDestination);

const redisConfig: RedisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
};
const counterDatabase = new RedisCounterDatabase(redisConfig);
counterDatabase.createConnection();
const trackService = new TrackService(logger, counterDatabase);
const countService = new CountService(counterDatabase);

export const Router = (app: Application): void => {
    app.get('/count', async (req: Request, res: Response) => {
        countService.getCount()
            .then(data => res.status(StatusCodes.OK).send(data))
            .catch(err => {
                handleError(err, res);
            })
    });

    app.use('/track', isBodyEmpty);
    app.post('/track', async (req: Request, res: Response) => {
        trackService.track(req.body)
            .then(data => res.status(StatusCodes.OK).send(data))
            .catch(err => {
                handleError(err, res);
            })
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        res.sendStatus(StatusCodes.NOT_FOUND);
    });
};

const handleError = (error: Error, res: Response) => {

    //console.log(error);

    if (error instanceof InvalidValueError) {
        const errorResp: ErrorResponseData = {
            errorType: InvalidValueError.name,
            message: error.message,
            status: StatusCodes.BAD_REQUEST
        };

        return res.status(StatusCodes.BAD_REQUEST).json(errorResp);
    }

    if (error instanceof ServiceConnectionError) {
        const errorResp: ErrorResponseData = {
            errorType: ServiceConnectionError.name,
            message: error.message,
            status: StatusCodes.INTERNAL_SERVER_ERROR
        };

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResp);
    }

    if (error instanceof RedisCounterDatabaseError) {
        const errorResp: ErrorResponseData = {
            errorType: RedisCounterDatabaseError.name,
            message: error.message || UNEXPECTED_ERROR_MESSAGE,
            status: StatusCodes.BAD_REQUEST
        };
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResp);
    }
    
    const errorResp: ErrorResponseData = {
        errorType: "Unexpected Error",
        message: UNEXPECTED_ERROR_MESSAGE,
        status: StatusCodes.BAD_REQUEST
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResp);
    
}
