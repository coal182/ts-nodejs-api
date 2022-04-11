import { RedisClientType } from '@node-redis/client';
import { createClient } from 'redis';

import { InvalidValueError, RedisCounterDatabaseError, ServiceConnectionError, UNEXPECTED_ERROR_MESSAGE } from "../../errors";
import { CounterDatabase,countKey } from './counter-database';


export type RedisConfig = {
    host?: string;
    port?: number;
};

export class RedisCounterDatabase implements CounterDatabase {
    private redisClient: RedisClientType;

    constructor(redisConfig: RedisConfig) {
        
        this.redisClient = createClient({ socket: redisConfig });

    }

    public async createConnection(): Promise<void> {
        try {
            const redisConnection = await this.redisClient.connect();
            return redisConnection;
        } catch (error) {
            throw new RedisCounterDatabaseError('Could not connect to redis: ' + error);
        }
    }

    public async getCount(): Promise<number> {
        try {
            const value = await this.redisClient.get(countKey);
            return Number(value) || 0;
        } catch (error) {
            throw new ServiceConnectionError('Could not get count in redis: ' + error);
        }
    }

    public async setCount(value: number): Promise<void> {
        try {
            await this.redisClient.set(countKey, value);
        } catch (error) {
            throw new RedisCounterDatabaseError('Could not set count in redis: ' + error);
        }
    }

    public async incrementCount(value: number): Promise<number> {
        try {
            const incrementedCount = await this.redisClient.incrBy(countKey, value);
            return Number(incrementedCount);
        } catch (error) {
            throw new RedisCounterDatabaseError('Could not persist the data in redis: ' + error);
        }
    }
}
