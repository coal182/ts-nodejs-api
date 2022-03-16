import { CounterDatabase } from '../src/infrastructure/counter/counter-database';

export class TestCounterDatabase implements CounterDatabase {
    constructor(private count = 0) {}

    public async getCount(): Promise<number> {
        return this.count;
    }

    public async setCount(value: number): Promise<void> {
        this.count = value;
    }
    public async incrementCount(value: number): Promise<number> {
        this.count += value;
        return this.count;
    }
}
