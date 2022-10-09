/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyScContract extends Contract {

    async myScExists(ctx, myScId) {
        const buffer = await ctx.stub.getState(myScId);
        return (!!buffer && buffer.length > 0);
    }

    async createMySc(ctx, myScId, value) {
        const exists = await this.myScExists(ctx, myScId);
        if (exists) {
            throw new Error(`The my sc ${myScId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myScId, buffer);
    }

    async readMySc(ctx, myScId) {
        const exists = await this.myScExists(ctx, myScId);
        if (!exists) {
            throw new Error(`The my sc ${myScId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myScId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMySc(ctx, myScId, newValue) {
        const exists = await this.myScExists(ctx, myScId);
        if (!exists) {
            throw new Error(`The my sc ${myScId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myScId, buffer);
    }

    async deleteMySc(ctx, myScId) {
        const exists = await this.myScExists(ctx, myScId);
        if (!exists) {
            throw new Error(`The my sc ${myScId} does not exist`);
        }
        await ctx.stub.deleteState(myScId);
    }

}

module.exports = MyScContract;
