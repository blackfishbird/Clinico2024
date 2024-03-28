'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const config = require('../config');
const logger = require('../lib/logger');
const TreeNode = require('../lib/treeNode');
const Policyholder = require('../models/policyholderModel');

function buildTree(nodes) {
    if(!nodes || !Array.isArray(nodes) || nodes.length === 0)
        return null;

    nodes[0].level = 0;
    let root = new TreeNode(nodes[0]);
    let q = [root];
    for(let i = 1, j = 1, total = 1; i < nodes.length; ) {
        let current = q.shift();

        if(i < nodes.length) {
            if((i + 1  - total) > (2 ** j)) {
                total += (2 ** j);
                j++;
            }

            nodes[i].parentCode = current.data.code;
            nodes[i].level = j;
            // current.data.leftCode = nodes[i].code;
            current.left = new TreeNode(nodes[i]);
            q.push(current.left);
            i++;
        }
        if(i < nodes.length) {
            if((i + 1  - total) > (2 ** j)) {
                total += (2 ** j);
                j++;
            }

            nodes[i].parentCode = current.data.code;
            nodes[i].level = j;
            // current.data.rightCode = nodes[i].code;
            current.right = new TreeNode(nodes[i]);
            q.push(current.right);
            i++;
        }
    }
    return root;
}

function printTree(root) {
    if(!root)
        return;
    printTree(root.left);
    logger(JSON.stringify(root.data) + "\n");
    printTree(root.right);
}

async function saveTree(root) {
    if(!root)
        return;
    saveTree(root.left);
    let data = _.pick(root.data, 'code', 'name', 'registration_date', 'introducer_code', 'level', 'parentCode');
    // logger(JSON.stringify(data) + "\n");
    await Policyholder.create(data);
    saveTree(root.right);
}

async function setDefaultPolicyholders() {
    await Policyholder.clear();
    try {
        let filePath = path.join(config.TMP_PATH, 'policyholders.json');
        logger(`Read file path: ${filePath}`);
        let jsonFile = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
        logger(jsonFile);

        let root = buildTree(jsonFile);
        await saveTree(root);
    } catch(err) {
        logger(err.message);
    }
    return await Policyholder.list();
}

async function createPolicyholder(data) {
}

async function getPolicyholder(code) {
    return await Policyholder.get(code);
}

async function getPolicyholders(code = null) {
    if(!code) {
        return await Policyholder.list();
    } else {
        let root = await getChildren(await Policyholder.get(code));
        return root;
    }
}

async function getChildren(root, count = 0) {
    if(!root)
        return;
    if(count++ > 4)
        return root;
    root = root.toObject();

    let children = await Policyholder.listByParent(root.code);
    if(Array.isArray(children) && children.length > 0) {
        root['l'] = await getChildren(children[0], count);
        root['r'] = await getChildren(children[1], count);
    }
    return root;
}

async function clearPolicyholders() {
    try {
        return await Policyholder.clear();
        return true;
    } catch(err) {
        logger(err.message);
        return false;
    }
}

module.exports = { setDefaultPolicyholders, getPolicyholder, getPolicyholders, clearPolicyholders };