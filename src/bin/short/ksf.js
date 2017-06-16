#!/usr/bin/env node

const { spawnSync } = require('child_process');
args = process.argv.slice(2)

let proc = spawnSync('k',['sf', ...args], {stdio:'inherit'})

