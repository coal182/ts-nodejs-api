import { LoggedData,Logger } from '../src/infrastructure/index'

export class TestLogger implements Logger {

    public loggedData: LoggedData = {
        records: [],
    };

    public logData(inputData: object): void {
        this.loggedData.records.push(inputData);
    }

}