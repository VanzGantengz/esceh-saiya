/// <reference types="node" />
import { WASocket } from '@adiwajshing/baileys-md';
import { EventEmitter } from 'events';
export declare class Clients extends EventEmitter {
    client: WASocket;
    private message;
    constructor(client: WASocket, message: any);
    private loadEvents;
    reply(text: string | undefined): void;
    loadError(error: Error | string): void;
}
