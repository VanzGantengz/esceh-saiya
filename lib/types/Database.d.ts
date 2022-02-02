/// <reference types="node" />
import { EventEmitter } from 'node:events';
export declare class Database extends EventEmitter {
    private client;
    constructor();
    connect(): Promise<boolean>;
    close(): Promise<void>;
    fetchAllUser(): Promise<any>;
    fetchUser(user: any): Promise<any>;
}
