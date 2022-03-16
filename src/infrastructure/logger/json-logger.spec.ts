import { assert,expect } from 'chai';
import * as fs from 'fs';

import { JsonLoggerCorruptedError } from '../../errors';
import { JsonLogger } from './json-logger';
import { LoggedData } from './logger';

describe('JsonLogger', () => {
    const destination = 'test/test-log-data.json';
    const invalidJsonDestination = 'test/invalid-json-file.json';
    const someRequest: object = {
        testProp1: 'test-1',
        testProp2: 'test-2'
    };
    let jsonLogger: JsonLogger;

    describe('when asks for log a request', () => {
        beforeEach(() => {
            jsonLogger = new JsonLogger(destination);
        });

        after(() => {
            fs.rmSync(destination);
        });

        describe('and file does not exist', () => {

            it('should create the file in the provided destination', () => {
                jsonLogger.logData(someRequest);
                expect(fs.existsSync(destination)).to.be.true;
            });

            assertSaveRequestCorrectly();
        });

        describe('and file already exists', () => {
            describe('and there is a valid json', () => {
                before(() => {
                    const initContent: LoggedData = {
                        records: [someRequest]
                    };

                    fs.writeFileSync(destination, JSON.stringify(initContent));
                });

                assertSaveRequestCorrectly();
            });

            describe('and there is a invalid json', () => {
                after(() => {
                    fs.rmSync(invalidJsonDestination);
                });

                it('should throw an error if there is a logger file with invalid JSON format', async () => {
                    fs.writeFileSync(invalidJsonDestination, 'invalid json content');
                    const jsonLogger = new JsonLogger(invalidJsonDestination);

                    await assert.throws(() => { jsonLogger.readData() }, JsonLoggerCorruptedError, `content of ${invalidJsonDestination} file is not a valid JSON`);

                });
            });
        });
    });

    function assertSaveRequestCorrectly() {
        it('should save the request in the file', () => {
            jsonLogger.logData(someRequest);
            const fileJsonData: LoggedData = JSON.parse(fs.readFileSync(destination).toString());
            expect(fileJsonData.records).to.deep.include(someRequest);
        });
    }
});
