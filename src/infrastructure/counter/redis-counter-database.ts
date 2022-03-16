import { RedisClientType } from '@node-redis/client';
import { createClient } from 'redis';

import { CounterDatabase,countKey } from './counter-database';

export type RedisConfig = {
    host?: string;
    port?: number;
};

export class RedisCounterDatabase implements CounterDatabase {
    private redisClient: RedisClientType;

    constructor(redisConfig: RedisConfig) {
        this.redisClient = createClient({ socket: redisConfig });
        this.connect();
    }

    private connect(): void {
        this.redisClient.connect();

        this.redisClient.on('error', (error: Error) => {
            throw error;
        });
    }

    public async getCount(): Promise<number> {
        const value = await this.redisClient.get(countKey);

        return Number(value) || 0;
    }

    public async setCount(value: number): Promise<void> {
        await this.redisClient.set(countKey, value);
    }

    public async incrementCount(value: number): Promise<number> {
        try {
            const incrementedCount = await this.redisClient.incrBy(countKey, value);
            return Number(incrementedCount);
        } catch (error) {
            console.error(error);
            throw new Error('Could not persist the data in redis');
        }
    }
}
