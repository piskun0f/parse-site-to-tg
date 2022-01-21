import { Bot } from './bot'
import { DB } from './db'
import { NewsParser } from './news-parser'
import { NewsItem } from '../types/news-item'

/**
 * Main class which parse news, save it and exec bot commands
 */
export class Main {
  db: DB
  bot: Bot
  parser: NewsParser

  constructor (dbUri: string, botToken: string, baseUri: string) {
    this.db = new DB(dbUri)
    this.bot = new Bot(botToken, this.db)
    this.parser = new NewsParser(baseUri)
  }

  async botWorker (): Promise<void> {
    console.log('[Bot] Bot launched')
    this.bot.launch()
  }

  async parsingWorker (): Promise<void> {
    await this.parseNews()
    setInterval(async () => {
      await this.parseNews()
    }, 1000 * 60)
  }

  async parseNews (): Promise<void> {
    const news = await this.parser.getNews()
    if (news) {
      for (const item of news) {
        if (await this.db.isNewsExists(item)) {
          console.log('[Db] News exists')
        } else {
          await this.db.createNews(item)
          await this.bot.sendNewNewsItem(new NewsItem(item))
          console.log('[Db] News created')
        }
      }
    }
  }

  async main (): Promise<void> {
    await Promise.all([this.parsingWorker(), this.botWorker()])
  }
}
