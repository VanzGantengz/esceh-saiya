import { WASocket, WAMessage, MessageUpdateType, proto } from '@adiwajshing/baileys-md';
export declare class convertMessage {
    msg: any;
    client: WASocket;
    constructor(msg: any, client: WASocket);
    reply(text: string, msg?: string, jid?: string): Promise<proto.WebMessageInfo>;
    fakeReply(text: string, _text: string, participant?: string, jid?: string): Promise<proto.WebMessageInfo>;
}
export interface IMessage {
    messages: WAMessage[];
    type: MessageUpdateType;
}
