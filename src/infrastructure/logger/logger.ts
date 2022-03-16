export interface Logger {
    logData(inputData: object): void;
}

export interface LoggedData {
    records: Array<object>;
}