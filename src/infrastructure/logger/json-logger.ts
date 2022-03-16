import * as fs from 'fs';

import { LoggedData,Logger } from './logger';

export class JsonLogger implements Logger {
    private destination: string;

    constructor(destination: string) {
        this.destination = destination;
        this.createDestinationIfNotExists();
    }

    private createDestinationIfNotExists(): void {
        if (!fs.existsSync(this.destination)) {
            const initialLogData: LoggedData = {
                records: []
            };

            fs.writeFileSync(this.destination, JSON.stringify(initialLogData));
        }
    }

    public logData(inputData: object): void {
    
        const loggedData: LoggedData = this.readData();

        loggedData.records.push(inputData);

        fs.writeFileSync(this.destination, JSON.stringify(loggedData, null, 2));
    }

    public readData(): LoggedData {
        const currentFileContent = fs.readFileSync(this.destination).toString();
        const loggedData: LoggedData = JSON.parse(currentFileContent);
        return loggedData;
    }
}
