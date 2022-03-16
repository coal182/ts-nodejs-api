export interface CounterDatabase {
    getCount: () => Promise<number>;
    setCount: (value: number) => Promise<void>;
    incrementCount: (value: number) => Promise<number>;
}

export const countKey = 'count';
