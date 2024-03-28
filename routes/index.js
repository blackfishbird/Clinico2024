'use strict';
const express = require('express');
const router = express.Router();

const policyholders = require('./policyholders');

router.use('/policyholders', policyholders.router);
router.use('/api/policyholders', policyholders.apiRouter);

router.get('/', (req, res) => {
	console.log(`hello world`);
    res.render('index', {
    	hello: 'hello world',
    });
});

module.exports = router;