// external module include with config
module.exports.prettyError = require('./conf/pretty-error')
module.exports.updateNotifier = require('./conf/update-notifier')

// external module
module.exports.colors = require('chalk')

// internal modules
module.exports.npm = require('./utility/npm')
module.exports.console = require('./utility/console')


// configured modules
const program = require('commander')

program.version(module.exports.npm.getPackageVersion())

module.exports.program = program


if (!process.argv.slice(2).length) {
    module.exports.console.displayHello()
}