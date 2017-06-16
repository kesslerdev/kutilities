#!/usr/bin/env node
var init = require('../lib/bootstrap')
    
init.program
    .command('symfony [options]', 'use the power of k for symfony project').alias('sf')
    .parse(process.argv);
