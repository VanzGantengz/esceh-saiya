import { Command } from '../functions/Command'

Command.addCommand({ name: 'test', type: ['test'], isOwner: false, run: async(msg, client) => {
  client.reply('y')
}})