export interface CounterDatabase {
    createConnection: () => Promise<void>;
    getCount: () => Promise<number>;
    setCount: (value: number) => Promise<void>;
    incrementCount: (value: number) => Promise<number>;
}

export const countKey = 'count';
