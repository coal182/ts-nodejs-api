import { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

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

const trackService = new TrackService(logger, counterDatabase);
const countService = new CountService(counterDatabase);

export const Router = (app: Application): void => {
    app.get('/count', async (req: Request, res: Response) => {
        return res.status(StatusCodes.OK).send(await countService.getCount());
    });

    app.use('/track', isBodyEmpty);
    app.post('/track', async (req: Request, res: Response) => {
        trackService.track(req.body, res)
            .then(data => res.status(StatusCodes.OK).send(data))
            .catch(err => {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            })
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        res.sendStatus(StatusCodes.NOT_FOUND);
    });
};
