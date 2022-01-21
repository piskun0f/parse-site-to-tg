import { INewsItem } from '.'

export class NewsItem implements INewsItem {
  header: string
  imageUrl: string
  text: string
  date: Date
  constructor (item: INewsItem) {
    this.header = item.header
    this.imageUrl = item.imageUrl
    this.text = item.text
    this.date = item.date
  }

  toTelegramMessage (): string {
    return `${this.header}\n\n\n${this.text.replace('\n', '\n\n')}\n\nДата: ${this.date.toLocaleString()}\n\n${this.imageUrl}`
  }
}
