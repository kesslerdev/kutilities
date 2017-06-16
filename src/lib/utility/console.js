var figlet = require('figlet');
 


module.exports.displayHello = function() {
    console.log(figlet.textSync('Kutil', {
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }))

    console.log('Utility commands for dev & ops')
}