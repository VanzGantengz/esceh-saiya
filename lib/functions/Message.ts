import { WASocket, proto } from '@adiwajshing/baileys'
import { format } from 'util'

export class convertMessage {
  constructor(public msg: any, public client: WASocket){
    if (!this.msg.messages[0]) return;
    msg = this.msg.messages[0];
    msg.type = Object.keys(msg.message)[0];
    msg.from = msg.key.remoteJid;
    msg.isGroup = msg.from.endsWith('@g.us');
    msg.sender = msg.isGroup ? msg.key.participant : msg.from
    msg.isOwner = msg.sender === '6282135250846@s.whatsapp.net' || msg.sender === '628564020165@s.whatsapp.net';
    msg.body = msg.message?.conversation || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || msg.message.extendedTextMessage?.text || '';
    msg.args = msg.body.trim().split(/ +/).slice(1)
    let [noPrefix, command] = msg.body.trim().split(/ +/)
    msg.noPrefix = noPrefix;
    msg.command = command;
  }
  async reply(text: string, msg?: string, jid?: string): Promise<proto.WebMessageInfo> {
    return await this.client.sendMessage(!jid ? this.msg.messages[0].key.remoteJid : jid, {
      text: format(text)
    }, {
      quoted: !msg ? this.msg.messages[0] : msg
    })
  }
  async fakeReply(text: string, _text: string, participant?: string, jid?: string): Promise<proto.WebMessageInfo> {
    let msg = this.msg.messages[0]
    msg.participant = !participant ? '0@s.whatsapp.net' : participant;
    msg.message.conversation = _text;
    return await this.reply(text, msg, !jid ? this.msg.messages[0].key.remoteJid : jid)
  }
}
