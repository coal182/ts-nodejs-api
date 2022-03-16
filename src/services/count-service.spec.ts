import { expect } from 'chai';
import { stub } from 'sinon';

import { TestCounterDatabase } from '../../test/test-counter-database';
import { ServiceConnectionError } from '../errors';
import { CountService, GetCountResponseData } from './count-service';

describe(CountService.name, () => {
    const countValue = 5;
    describe('when asked to get count', () => {
        describe('and database service is working', () => {
            const countService = new CountService(new TestCounterDatabase(countValue));

            it('should return the count value successfully', async () => {
                const expectedResponse: GetCountResponseData = {
                    count: countValue
                };

                expect(await countService.getCount()).to.deep.equal(expectedResponse);
            });
        });

        describe('and database service is not working', () => {
            it('should throw an error', async () => {
                const failCounterDatabase = new TestCounterDatabase();
                const countService = new CountService(failCounterDatabase);

                const error = new Error('Server has failed');
                stub(failCounterDatabase, 'getCount').rejects(error);

                await expect(countService.getCount()).to.be.rejectedWith(ServiceConnectionError);
            });
        });
    });
});
