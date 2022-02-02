import { DisconnectReason } from '@adiwajshing/baileys'
import { Client } from './lib/connection/Client'
import { loadCommands } from './lib/functions/Handler'
import { Database } from './lib/connection/Database'

new loadCommands(`${process.cwd()}/lib/command/`)
let client = new Client()
let database = new Database()

client.on('CL:connection', code => {
  if (code != DisconnectReason.loggedOut){
    console.log('[ INFO ] Connection closed on code: '+code)
    client = new Client()
  }
  else {
    console.log('[ INFO ] Session was closed.')
    process.exit()
  }
})

database.connect()
database.on('DB:connect', data => {
  globalThis.dbClient = data.client;
  globalThis.db = data.db;
  globalThis.database = database;
  console.log('[ INFO ] Connect to database')
})
database.on('DB:close', () => {
  console.log('[ INFO ] Disconnected from database')
})
