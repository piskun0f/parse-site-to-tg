import { Connection, createConnection, Model, Schema } from 'mongoose'
import { IChat, INewsItem } from '../types'

const NewsItemScheme = new Schema({
  header: String,
  imageUrl: String,
  text: String,
  date: Date
})

const ChatScheme = new Schema({
  chatId: Number,
  connectedDate: Date
})

export class DB {
  dbUri: string
  connectionsCount = 2
  connections: Connection[] = []
  NewsItemModel: Model<INewsItem>
  ChatModel: Model<IChat>

  constructor (dbUri: string) {
    this.dbUri = dbUri

    for (let i = 0; i < this.connectionsCount; i++) {
      this.connections.push(createConnection(this.dbUri))
    }
    this.NewsItemModel = this.connections[0].model<INewsItem>('news', NewsItemScheme)
    this.ChatModel = this.connections[1].model<IChat>('chats', ChatScheme)
  }

  createConnection (): Connection {
    const connection = createConnection(this.dbUri)
    if (connection) {
      return connection
    } else {
      throw new Error('Can not connect to mongo')
    }
  }

  async closeConnection (connection: Connection): Promise<void> {
    await connection.close()
  }

  async createNews (newsItem: INewsItem): Promise<void> {
    await this.NewsItemModel.create(newsItem)
  }

  async isNewsExists (newsItem: INewsItem): Promise<boolean> {
    return (await this.NewsItemModel.findOne(newsItem).exec()) != null
  }

  async createChat (chatId: number): Promise<void> {
    await this.ChatModel.create({
      chatId: chatId,
      connectedDate: new Date()
    })
  }

  async isChatExists (chatId: number): Promise<boolean> {
    return (await this.ChatModel.findOne({ chatId: chatId }).exec()) != null
  }

  async getChats (): Promise<IChat[] | undefined> {
    const chats = await this.ChatModel.find({}).exec()
    if (chats) {
      return chats as unknown as IChat[]
    }
  }
}
