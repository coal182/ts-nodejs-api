import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CounterDatabase } from '../infrastructure/counter/counter-database';


export interface GetCountResponseData {
    count: number;
}

export class CountService {
    private counterDatabase;

    constructor(counterDatabase: CounterDatabase) {
        this.counterDatabase = counterDatabase;
    }

    public async getCount(): Promise<GetCountResponseData | void> {
      
        const count = await this.counterDatabase.getCount();

        return {
            count: Number(count)
        };
    }

}
