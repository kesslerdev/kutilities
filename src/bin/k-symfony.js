
const init = require('../lib/bootstrap')
const symfony = require('../lib/utility/symfony')

init.program
  .arguments('<tasks>')

init.program.parse(process.argv)


const sf = new symfony()

sf.call(...init.program.args)
