import { Response, response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { InvalidValueError } from "../errors";
import { CounterDatabase, LoggedData, Logger } from '../infrastructure/index';
import { hasCount,isStringEmpty,isZero,notNumber } from './../utils';

interface RequestBody {
    [key: string]: unknown;
    count?: number|string;
}

export interface TrackResponseData {
    message: string;
    previousCount?: number;
    count: number;
}

export class TrackService {
    private logger;
    private counterDatabase;

    constructor(logger: Logger, counterDatabase: CounterDatabase) {
        this.logger = logger;
        this.counterDatabase = counterDatabase;
    }

    public async track(body: RequestBody): Promise<TrackResponseData | void> {

        this.logger.logData(body);            

        const currentCount = await this.counterDatabase.getCount();
        
        if (this.validateCountValue(body)) {
            
            const incrementCount = Number(body.count);
            const newCount = await this.counterDatabase.incrementCount(incrementCount);

            const trackResponse: TrackResponseData = {
                message: 'Count has been increased successfully',
                previousCount: currentCount,
                count: newCount
            }

            return trackResponse;
        }

        const trackResponse: TrackResponseData = {
            message: 'The request has been logged successfully',
            count: currentCount
        }

        return trackResponse;

    }

    

    private validateCountValue(body: RequestBody) {

        if (hasCount(body)){

            const count = body.count;

            if (typeof count === 'string') {
                
                if (isStringEmpty(count)) { throw new InvalidValueError('count value cannot be empty') }
                if (notNumber(count)) { throw new InvalidValueError('count value must be a number') }
                if (isZero(count)) { throw new InvalidValueError('count value cannot be zero') }
    
                return true;
    
            } else if (typeof count === 'number') {
    
                if (isZero(count)) { throw new InvalidValueError('count value cannot be zero') }
    
                return true;
    
            } else {
    
                throw new InvalidValueError('count value is not a valid number');
    
            }

        }else{
            return false;
        }        

    }

}
