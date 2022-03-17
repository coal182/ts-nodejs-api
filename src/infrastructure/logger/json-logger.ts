import * as fs from 'fs';

import { JsonLoggerCorruptedError } from '../../errors';
import { LoggedData, Logger } from './logger';

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

    public async logData(inputData: object): Promise<void> {
        const loggedData: LoggedData = this.readData();

        loggedData.records.push(inputData);

        fs.writeFileSync(this.destination, JSON.stringify(loggedData, null, 2));
    }

    public readData(): LoggedData {
        const currentFileContent = fs.readFileSync(this.destination).toString();
        try {
            const loggedData: LoggedData = JSON.parse(currentFileContent);
            return loggedData;
        } catch (error) {
            throw new JsonLoggerCorruptedError(`content of ${this.destination} file is not a valid JSON`);
        }
    }
}
