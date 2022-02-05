import {
    ICommand
} from '../types/Command'

class command {
    private data = new Map;
    constructor() {}
    public addCommands(opt: ICommand) {
        this.data.set('commands', opt)
    }
    public addCommand(opt: ICommand) {
        this.data.set('commands', opt)
    }
    public addFunctions(opt: any) {
        this.data.set('functions', opt)
    }
    public addFunction(opt: any) {
        this.data.set('functions', opt)
    }
}
export const Command: Commands = new command()
export interface Commands {
    addCommands(opt: ICommand)
    addCommand(opt: ICommand)
    addFunction(opt: any)
    addFunctions(opt: any)
}