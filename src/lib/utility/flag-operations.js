
// TODO: Big opti is needed
module.exports = class FlagOperations {

    constructor(operations) {
        this._operations = operations
    }

    get OperationNames(){
        return this._ops_names || (
            this._ops_names = Reflect.ownKeys(this._operations).sort(function(a, b){
                // ASC  -> a.length - b.length
                // DESC -> b.length - a.length
                return b.length - a.length;
            })
        )
    }

    isValid(arg) {
        return Reflect.ownKeys(this.getOperations(arg)).length > 0
    }

    getOperations(arg) {
        if (!arg) {
            throw new Error(`Invalid operation list ${arg}`)
        }

        const actionsToDo = {}
        let actionStream = arg

        this.OperationNames.map((e) => {
            if((actionStream.split(e).length - 1) > 1) {
                throw new Error(`Operation ${e} found ${(actionStream.split(e).length - 1)} times only one is accepted`)
            }

            if(actionStream.indexOf(e) !== -1) {
                actionsToDo[e] = this._operations[e]
                actionStream = actionStream.replace(e, '')
            }
        })

        if(actionStream.length > 0 && Reflect.ownKeys(actionsToDo).length != 0) {
            throw new Error(`Invalid operation list ${arg} found ${Reflect.ownKeys(actionsToDo).join(',')} but ${actionStream} are undefined`)
        }

        return actionsToDo
    }
    parseArgs(arg) {
        let actionsToDo = this.getOperations(arg)

        let task = {
            exec: [],
            modifiers: []
        }

        // Class cmd & modifiers
        Reflect.ownKeys(actionsToDo).map((e) => {
            if (actionsToDo[e].exec) {
                task.exec.push(e)
            } else if (actionsToDo[e].for) {
                task.modifiers.push(e)
            }
        })

        task.modifiers.map((e) => {
            // check should have at least one cmd to apply to
            let applyTo = [].concat( actionsToDo[e].for )
            let applyed = false
            
            applyTo.map((apply) => {
                if (task.exec.indexOf(apply) !== -1) {

                    if(!actionsToDo[apply].modifiers) actionsToDo[apply].modifiers = {}
                    actionsToDo[apply].modifiers[e] = actionsToDo[e]
                    delete actionsToDo[e]

                    applyed = true
                }
            })

            if (!applyed) {
                throw new Error(`Modifier ${e} has to be used on ${applyTo.join(',')} operation(s)`)
            }
        })

        let sortedActions = {}
        Reflect.ownKeys(actionsToDo).sort(function(a, b){
                // ASC  -> a.length - b.length
                // DESC -> b.length - a.length
                return (actionsToDo[b].priority ? actionsToDo[b].priority : 0) 
                    - (actionsToDo[a].priority ? actionsToDo[a].priority : 0)
            }).map((act)=>{
                sortedActions[act] = actionsToDo[act]
            })

        return sortedActions
    }

    process(arg, context) {
        const actionsToDo = this.parseArgs(arg)

        console.log(context)
        Reflect.ownKeys(actionsToDo).map((cmd)=>{
            this.processCmd(actionsToDo[cmd], context)
        })
    }

    processCmd(cmd, context) {
        let exec = this.buildCommand(cmd, context)
        console.log(exec)
    }

    buildCommand(cmd, context) {
        if (cmd.exec) {
            let exec = cmd.exec

            return exec
        } else {
            throw new Error('invalid operation execution')
        }
        
    }

    replaceContext(cmd, context) {
        
    }

}