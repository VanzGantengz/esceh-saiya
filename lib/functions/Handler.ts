import { WASocket } from '@adiwajshing/baileys'
import { readdirSync } from 'fs'
import { format } from 'util'
import { IMessage, ICommand } from '../types'
import { Clients } from '../connection/Clients'
import { convertMessage } from './Message'
import { Config } from '../config'

export default class Handler extends Clients {
  public command = new Map;
  constructor(public msg: IMessage, public client: WASocket){
    super(client, msg)
    this.create()
  }
  private async create(){
    try {
      let m = new convertMessage(this.msg, this.client)
      let msg = m.msg.messages[0];
      if (msg.noPrefix == '>'){
        try {
          let q = msg.args.join(' ')
          if (!msg.isOwner) return;
          let text = (format(await eval(q))).replace(Config.MONGGO_URI, 'uri gw anjg').replace(undefined, 'undepined<😅☝🏻>')
          this.client.sendMessage(msg.from, {
            text
          }, {
            quoted: msg
          })
        } catch (e) {
          this.client.sendMessage(msg.from, {
            text: format(e)
          }, {
            quoted: msg
          })
        }
      }
    } catch(e) {
      //this.loadError(e);
      return;
    }
  }
  public getCommands(name){
    return void this.command.get(name)
  }
}
export class loadCommands {
  constructor(public path: string){
    (async() => {
      readdirSync(path).forEach((file) => {
        import(path + file)
        console.log('[ INFO ] Loading ' + file)
      })
    })();
  }
}
