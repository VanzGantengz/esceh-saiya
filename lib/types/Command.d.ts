import { IMessage } from './Message';
import { WASock } from '@adiwajshing/baileys-md';
export interface ICommand {
    name: string;
    type: string[];
    isOwner?: boolean;
    isGroup?: boolean;
    defaultPrefix?: boolean;
    run(msg: IMessage, client: WASock): any;
}
