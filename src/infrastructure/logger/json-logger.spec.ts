import { assert,expect} from "chai";
import { response } from "express";
import { spy,stub } from "sinon";

import { JsonLogger,LoggedData } from '../index';

describe('JsonLogger', () => {

    const requestBodyWithCount = {
        foo: 'foo',
        bar: 'bar',
        count: 1
    }

    let logger: JsonLogger;
    let loggerDestination: string;

    beforeEach(() => {

        loggerDestination = 'test/test-log-data.json';
        logger = new JsonLogger(loggerDestination);

    });

    describe('when asked to handle the request', () => {

        it('should log the requests', async () => {
            expect(false).to.be.true;
        });
        

    });
});