'use strict';
const mongoose = require('mongoose');

const logger = require('../lib/logger');

class Policyholder {
    constructor(data) {
    }

    static get(code) {
        return this.findOne({ code }, { _id: false });
    }

    static list() {
        return this.find({}, { _id: false });
    }

    static listByParent(parentCode) {
        return this.find({ parentCode }, { _id: false });
    }

    static listByLevel(level) {
        return this.find({ level }, { _id: false });
    }

    static clear() {
        return this.collection.drop();
    }
}

let policyholderSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    registration_date: {
        type: Date,
        default: Date.now,
    },
    introducer_code: {
        type: String,
    },
    level: {
        type: Number,
    },
    parentCode: {
        type: String,
    },
    // leftCode: {
    //     type: String,
    // },
    // rightCode: {
    //     type: String,
    // },
});
policyholderSchema.loadClass(Policyholder);

module.exports = mongoose.model('Policyholder', policyholderSchema);