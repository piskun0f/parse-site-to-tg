import axios from 'axios'
import cheerio from 'cheerio'
import { INewsItem } from '../types'

export class NewsParser {
  BASE_URL: string
  NEWS_URL: string

  constructor (baseUrl: string) {
    this.BASE_URL = baseUrl
    this.NEWS_URL = baseUrl + '/news'
  }

  async donwloadDataFromUrl (url: string): Promise<string | undefined> {
    try {
      console.log(`Start download data from ${url}`)
      const { data } = await axios.get(url)
      console.log('Data downloaded')
      return data
    } catch (err) {
      console.log(err)
    }
  }

  async getNewsFromHtml (htmlData: string): Promise<INewsItem[]> {
    const news: INewsItem[] = []

    const $ = cheerio.load(htmlData)
    const listItems = $('#latestNews .articleItem')
    for (const el of listItems) {
      const subPageUrl = this.BASE_URL + $(el).children('.img').attr('href')
      if (subPageUrl) {
        const subPageData = await this.donwloadDataFromUrl(subPageUrl)
        if (subPageData) {
          const $$ = cheerio.load(subPageData)

          const header = $$('.articleHeader').first()
          const imageUrl = $$('#carouselImage').attr('src')
          const text = $$('.articlePage')
          text.children('#imgCarousel').remove()
          text.children('.outerEleWrapper').remove()

          const dateString = $$('.contentSectionDetails span').text()
          const dateStr = dateString.match(/\(.+\)/gm)
          let date = null
          if (dateStr) {
            const dateTemp = dateStr[0].toString().slice(1, dateStr[0].toString().length - 1) + ':00'
            const dateParts = dateTemp.split(' ')[0].split('.')
            const timeParts = dateTemp.split(' ')[1].split(':')
            date = new Date(+dateParts[2], +dateParts[1], +dateParts[0], +timeParts[0], +timeParts[1])
          }

          if (header.text() && imageUrl && text.text() && date) {
            news.push({
              header: header.text(),
              imageUrl: imageUrl,
              text: text.text().trim(),
              date: date
            })
          }
        }
      }
    }
    news.sort((a: INewsItem, b: INewsItem) => {
      return a.date > b.date ? 1 : -1
    })
    return news
  }

  async getNews (): Promise<INewsItem[] | undefined> {
    const dataHtml = await this.donwloadDataFromUrl(this.NEWS_URL)
    if (dataHtml) {
      const news = await this.getNewsFromHtml(dataHtml)
      return news
    }
  }
}
