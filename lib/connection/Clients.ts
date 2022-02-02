import { WASocket } from '@adiwajshing/baileys'
import { EventEmitter } from 'events'
import { format } from 'util'
import { IMessage } from '../types/Message'
import FileType from 'file-type'
import * as fs from 'node:fs'

export class Clients extends EventEmitter {
  private messages;
  constructor(public client: WASocket, private message: any){
    super()
    this.messages = message.messages[0]
    this.loadEvents()
  }
  private loadEvents(){
    this.client.ws.on('CB:call', call => {
      this.emit('WS:call', call)
    })
    this.client.ev.on('chats.set', chats => {
      this.emit('CLI:chats', chats)
    })
    this.client.ev.on('messages.set', messages => {
      this.emit('CLI:messages', messages)
    })
    this.client.ev.on('groups.update', groups => {
      this.emit('CLI:groups', groups)
    })
    this.client.ev.on('group-participants.update', participants => {
      let pp = []
      participants.participants.forEach(async(p) => {
        let getPp = await this.client.profilePictureUrl(p).catch(_ => undefined)
        pp.push({
          participants: p,
          pp: getPp
        })
      })
      this.emit('CLI:group-participants', {
        id: participants.id,
        pp,
        action: participants.action
      })
    })
  }
  public async reply(text: string | undefined, type?: string): Promise< void > {
    let buff = Buffer.isBuffer(text) ? await FileType(text) : text;
    if (buff.mime != undefined){
      await this.client.sendMessage(this.messages.key.remoteJid, {
        [buff.mime.split('/')[0]]: text,
        disappearingMessagesInChat: true
      }, {
        quoted: this.messages
      })
    } else {
      await this.client.sendMessage(this.messages.key.remoteJid, {
        text: format(buff)
      }, {
        quoted: this.messages
      })
    }
  }
  
  public loadError(error: Error | string){
    this.emit('error', String(error))
  }
}