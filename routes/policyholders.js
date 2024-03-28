'use strict';
const express = require('express');
const router = express.Router();
const apiRouter = express.Router();

const Policyholder = require('../controllers/policyholderController');

/**
router.get('/', (req, res) => {
    console.log(`hello policyholder`);
    res.render('policyholders', {
        code: ''
    });
});
*/

router.get('/:code', (req, res) => {
    let { code } = req.params;
    console.log(`hello policyholder ${code}`);
    res.render('policyholders', { code });
});

apiRouter.get('/', async (req, res) => {
    let tree = await Policyholder.getPolicyholders();
    res.send(tree);
});

apiRouter.get('/:code', async (req, res) => {
    let { code } = req.params;
    let tree = await Policyholder.getPolicyholders(code);
    res.send(tree);
});

apiRouter.get('/:code/top', async (req, res) => {
    let { code } = req.params;
    let policyholder = await Policyholder.getPolicyholder(code);
    if(policyholder) {
        let tree = await Policyholder.getPolicyholders(policyholder.parentCode);
        res.send(tree);
    }
});

apiRouter.post('/tmp', async (req, res) => {
    let policyholders = await Policyholder.setDefaultPolicyholders();
    res.send(policyholders);
});

apiRouter.post('/clear', async (req, res) => {
    res.send(await Policyholder.clearPolicyholders());
});

module.exports = { router, apiRouter };