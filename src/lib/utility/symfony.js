
const fs = require('fs')
const path = require('path')
const FlagOperations = require('./flag-operations')
const { spawnSync } = require('child_process');

const _actions = {
    cc: {
        exec: `{SF_CONSOLE} cache:clear {SF_ENV}`,  // SF console command
        priority: 100
    },
    dbd: {
        exec: `{SF_CONSOLE} doctrine:migrations:diff {SF_ENV}`
    },
    dbm: {
        exec: `{SF_CONSOLE} doctrine:migrations:migrate {SF_ENV}`
    },
    dbr: {
        exec: `{SF_CONSOLE} doctrine:migrations:migrate prev {SF_ENV}`
    },
    b: {
        exec: `{SF_BIN}/behat`
    },
    gb: {
        exec: `git list-modified | grep -E "tests.*\.feature$" > /tmp/behat.temp.scenarios && {SF_BIN}/behat /tmp/behat.temp.scenarios && rm /tmp/behat.temp.scenarios`
    },
    mock: {
        exec: `{SF_BIN}/sf3_restart_mock_servers`,
        priority: 50
    },
    r: {
        option: `--rerun`,
        for: [`b`,`gb`] // which bin or exec action to apply array or string
    },
    s: {
        option: `--stop-on-failure`,
        for: [`b`,`gb`]
    }
}

module.exports = class Symfony {
    constructor(path = null) {
        this._dir = path ? path : process.cwd()
        this.init()
    }

    init() {
        if( fs.existsSync(this.sf3Path)) {
            this._path = this.sf3Path
        } else if(fs.existsSync(this.sf2Path)) {
            this._path = this.sf2Path
        } else {
            throw new Error('It\'s not a Sf 2/3 Project')
        }

        this.operations = new FlagOperations(_actions)
    }

    get sf3Path() {
        return path.normalize(this._dir + '/bin/console')
    }
    get sf2Path() {
        return path.normalize(this._dir + '/app/console')
    }

    call(arg) {
        if(this.operations.isValid(arg))
            this.operations.process(arg, this.Context)
        else
            spawnSync(this._path, process.argv.slice(2), {stdio:'inherit'})
    }

    get Context() {
        return {
            SF_CONSOLE: this._path,
            SF_BIN: path.normalize(this._dir + '/bin/'),
            SF_ENV: `--env=test`
        }
    }
}