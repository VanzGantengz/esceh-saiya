import {
    EventEmitter
} from 'node:events'
import {
    MongoClient,
    Document
} from 'mongodb'
import {
    Config
} from '../config'

export class Database extends EventEmitter {
    private client;
    constructor() {
        super()
    }
    async connect() {
        this.client = new MongoClient(Config.MONGGO_URI)
        await this.client.connect()
        let db = this.client.db('data');
        this.emit('DB:connect', {
            client: this.client, db
        })
        return !0
    }
    async close() {
        await this.client.close()
        this.emit('DB:close', null)
    }
    async fetchAllUser() {
        return globalThis.db.collection('user').find({}).toArray()
    }
    async fetchUser(user) {
        return globalThis.db.collection('user').find({
            user
        }).toArray()
    }
}