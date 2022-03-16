import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const isBodyEmpty = (req: Request, res: Response, next: NextFunction) => {
    if (!Object.keys(req.body).length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Empty body'
        });
    }

    next();
};
