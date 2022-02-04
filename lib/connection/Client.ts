import makeWASocket, {
    useSingleFileAuthState,
    WAMessage,
    WASocket,
    DisconnectReason,
    makeInMemoryStore
} from '@adiwajshing/baileys'
import {
    EventEmitter
} from 'node:events'
import {
    Boom
} from '@hapi/boom'
import P from 'pino'
import Handler from '../functions/Handler'
import {
    IMessage
} from '../types/Message'

const {
    state,
    saveState
} = useSingleFileAuthState('../auth.json')
const store = makeInMemoryStore({
    logger: P().child({
        level: 'debug', stream: 'store'
    })
})
export class Client extends EventEmitter {
    public client: WASocket;
    constructor() {
        super();
        (async() => {
            try {
                setInterval(() => {
                    store.writeToFile('../auth.json')
                }, 10_000)
                this.client = makeWASocket({
                    auth: state,
                    printQRInTerminal: true
                })
                store.bind(this.client.ev)
                this.client.ev.on('messages.upsert', (msg: IMessage) => {
                    try {
                        if (!msg.messages[0]) return;
                        else new Handler(msg, this.client)
                    } catch(e) {
                        return;
                    }
                })
                this.client.ev.on('creds.update',
                    saveState)
                this.client.ev.on('connection.update',
                    update => {
                        if (update.connection == 'close') {
                            this.emit('CL:connection', (update.lastDisconnect.error as Boom)?.output?.statusCode)
                        }
                    })
            } catch(e) {
                console.log(e)
            }
        })()
    }
}