/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MyScContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MyScContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MyScContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my sc 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my sc 1002 value"}'));
    });

    describe('#myScExists', () => {

        it('should return true for a my sc', async () => {
            await contract.myScExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my sc that does not exist', async () => {
            await contract.myScExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMySc', () => {

        it('should create a my sc', async () => {
            await contract.createMySc(ctx, '1003', 'my sc 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my sc 1003 value"}'));
        });

        it('should throw an error for a my sc that already exists', async () => {
            await contract.createMySc(ctx, '1001', 'myvalue').should.be.rejectedWith(/The my sc 1001 already exists/);
        });

    });

    describe('#readMySc', () => {

        it('should return a my sc', async () => {
            await contract.readMySc(ctx, '1001').should.eventually.deep.equal({ value: 'my sc 1001 value' });
        });

        it('should throw an error for a my sc that does not exist', async () => {
            await contract.readMySc(ctx, '1003').should.be.rejectedWith(/The my sc 1003 does not exist/);
        });

    });

    describe('#updateMySc', () => {

        it('should update a my sc', async () => {
            await contract.updateMySc(ctx, '1001', 'my sc 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my sc 1001 new value"}'));
        });

        it('should throw an error for a my sc that does not exist', async () => {
            await contract.updateMySc(ctx, '1003', 'my sc 1003 new value').should.be.rejectedWith(/The my sc 1003 does not exist/);
        });

    });

    describe('#deleteMySc', () => {

        it('should delete a my sc', async () => {
            await contract.deleteMySc(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my sc that does not exist', async () => {
            await contract.deleteMySc(ctx, '1003').should.be.rejectedWith(/The my sc 1003 does not exist/);
        });

    });

});
