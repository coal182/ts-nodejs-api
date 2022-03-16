import { Response } from 'express';

import { CounterDatabase } from '../infrastructure/counter/counter-database';
import { ServiceConnectionError } from './../errors';

export interface GetCountResponseData {
    count: number;
}

export class CountService {
    private counterDatabase;

    constructor(counterDatabase: CounterDatabase) {
        this.counterDatabase = counterDatabase;
    }

    public async getCount(): Promise<GetCountResponseData> {
        try {
            const count = await this.counterDatabase.getCount();

            return {
                count: Number(count)
            };
        } catch (error) {
            const errMsg = `Connection with counter service has failed: ${error}`;
            throw new ServiceConnectionError(errMsg);
        }
    }
}
