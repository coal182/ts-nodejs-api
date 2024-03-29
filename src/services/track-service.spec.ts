import { expect } from 'chai';
import { response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SinonSpy, spy, stub } from 'sinon';

import { TestCounterDatabase } from '../../test/test-counter-database';
import { TestLogger } from '../../test/test-logger';
import { InvalidValueError } from '../errors';
import { TrackResponseData, TrackService } from './track-service';

describe('TrackService', () => {
    const requestBody = {
        foo: 'foo',
        bar: 'bar'
    };

    const requestBodyWithCount = {
        foo: 'foo',
        bar: 'bar',
        count: 2
    };

    const requestBodyWithInvalidCount = {
        foo: 'foo',
        bar: 'bar',
        count: 'any string'
    };

    const requestBodyWithZeroCount = {
        foo: 'foo',
        bar: 'bar',
        count: 0
    };

    const requestBodyWithEmptyCount = {
        foo: 'foo',
        bar: 'bar',
        count: ''
    };

    let trackService: TrackService;
    let testCounterDatabase: TestCounterDatabase;
    let testLogger: TestLogger;
    const spyResponse = spy(response, 'status');

    beforeEach(() => {
        testCounterDatabase = new TestCounterDatabase();
        testLogger = new TestLogger();
        trackService = new TrackService(testLogger, testCounterDatabase);
    });

    describe('when asked to handle the request', () => {
        it('should log the requests', async () => {
            trackService.track(requestBody);
            expect(testLogger.loggedData.records.length).to.be.greaterThan(0);
        });

        describe('and request body contains count property', () => {
            it('should return a TrackResponseData', async () => {
                const oldCount = await testCounterDatabase.getCount();
                const reqCount = requestBodyWithCount.count;
                const expectedCount = Number(oldCount) + reqCount;
                const expectedTrackResponseData: TrackResponseData = {
                    message: 'Count has been increased successfully',
                    previousCount: oldCount,
                    count: expectedCount
                };                
                expect(await trackService.track(requestBodyWithCount)).to.deep.equal(expectedTrackResponseData);
            });
            
            describe('and count property is not a number', () => {
                it('should response with bad request with not a number value message', async () => {                    
                    expect( trackService.track(requestBodyWithInvalidCount) ).to.be.rejectedWith(new InvalidValueError('count value must be a number'));
                });
            });

            describe('and count property is zero', () => {
                it('should response with bad request with zero value message', async () => {
                    expect( trackService.track(requestBodyWithZeroCount) ).to.be.rejectedWith(new InvalidValueError('count value cannot be zero'));
                });
            });

            describe('and count property is empty', () => {
                it('should throw an InvalidValueError with empty value message ', async () => {
                    expect( trackService.track(requestBodyWithEmptyCount) ).to.be.rejectedWith(new InvalidValueError('count value cannot be empty'));
                });
            });

            /*
            describe('and count property is zero', () => {
                it('should response with bad request ', async () => {
                    await trackService.track(requestBodyWithZeroCount, response);
                    expect(spyResponse.firstCall.firstArg).to.be.equal(StatusCodes.BAD_REQUEST);
                });
            });
            */
        });
    });
});
