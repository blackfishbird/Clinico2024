"use strict";

module.exports = Object.freeze({
    PORT:
        process.env.PORT || 3000,
    TMP_PATH:
        process.env.TMP_PATH || './tmp',
    MONGO_URL:
        process.env.MONGO_URL || 'mongodb://localhost:27017/clinico',
});