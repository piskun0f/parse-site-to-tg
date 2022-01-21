import { Telegraf } from 'telegraf'
import { DB } from './db'
import { NewsItem } from '../types/news-item'

export class Bot extends Telegraf {
  db: DB

  constructor (token: string, db: DB) {
    super(token)
    this.db = db
    this.init()
  }

  init (): void {
    // start command
    this.command('start', ctx => {
      console.log(`[Bot] ${ctx.from}`)
      this.telegram.sendMessage(ctx.chat.id, 'Hello! I will help you to check finance news in your chat.')
    })

    this.command('registration', async ctx => {
      console.log(`[Bot] Registration command chat ${ctx.chat.id}`)

      if (await this.db.isChatExists(ctx.message.chat.id)) {
        ctx.reply('The chat is already registered')
      } else {
        await this.db.createChat(ctx.message.chat.id)
        ctx.reply('The chat was registered')
      }
    })
  }

  async sendNewNewsItem (newsItem: NewsItem): Promise<void> {
    const chats = await this.db.getChats()
    if (chats) {
      for (const chat of chats) {
        this.telegram.sendMessage(chat.chatId, newsItem.toTelegramMessage())
        console.log(`[BOT] Sended news to ${chat.chatId}`)
      }
    } else {
      console.log('[BOT] Chats is empty')
    }
  }
}
