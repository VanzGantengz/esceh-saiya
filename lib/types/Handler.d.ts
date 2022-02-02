import { WASocket } from '@adiwajshing/baileys-md';
import { IMessage } from '../types';
import { Clients } from '../connection/Clients';
export default class Handler extends Clients {
    msg: IMessage;
    client: WASocket;
    command: Map<any, any>;
    constructor(msg: IMessage, client: WASocket);
    private create;
    getCommands(name: any): any;
}
export declare class loadCommands {
    path: string;
    constructor(path: string);
}
