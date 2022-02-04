import { WASocket, proto } from '@adiwajshing/baileys'
import { EventEmitter } from 'node:events'
import { format } from 'util'
import { URL } from 'node:url'
import { IMessage } from '../types/Message'
import FileType from 'file-type'
import fetch from 'node-fetch'
import Fetcher from '../Fetcher'
import * as fs from 'node:fs'

export type IGetBuff = {
  result: Buffer | null
  type: string | null,
  error: Error | null
}

export class Clients extends EventEmitter {
  private messages;
  constructor(public client: WASocket, private message: any){
    super()
    this.messages = message.messages[0]
    this._loadEvents()
  }
  private _loadEvents(){
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
      this.emit('CLI:group-mem', {
        id: participants.id,
        pp,
        action: participants.action
      })
    })
  }
  public async reply(text: string | undefined | Buffer, opt?: object | undefined | string, dmic?: boolean): Promise<void>{
    let buff = Buffer.isBuffer(text) ? await FileType(text) : text;
    if (buff.mime != undefined){
      await this.client.sendMessage(this.messages.key.remoteJid, {
        [buff.mime.split('/')[0]]: buff,
        disappearingMessagesInChat: dmic
      }, {
        quoted: !opt ? this.messages : opt
      })
    } else {
      await this.client.sendMessage(this.messages.key.remoteJid, {
        text: format(buff)
      }, {
        quoted: !opt ? this.messages : opt
      })
    }
  }
  public async fakeReply(text: string, footer: string, jid?: string, dmc?: boolean): Promise<void>{
      let msg = this.messages;
      msg.participant = !jid ? '0@s.whatsapp.net' : jid;
      msg.message.conversation = footer;
      await this.reply(text, msg, dmc)
  }
  public async getBuffer(url: URL): Promise<IGetBuff>{
    Fetcher
      .get(url)
      .setEncoding('buffer')
      .end(function(err, buff){
        if (!err) {
          return {
            type: FileType(buff),
            result: buff,
            error: null
          } else {
            return {
              type: null,
              result: null,
              error: err
            }
          }
        }
      })
  }
    
  public loadError(error: Error | string){
    this.emit('Error', String(error))
  }
}
