import './modules/env'
import { Main } from './modules/main'

(async () => {
  if (process.env.DB_URI && process.env.BOT_TOKEN && process.env.BASE_URL) {
    const main = new Main(process.env.DB_URI, process.env.BOT_TOKEN, process.env.BASE_URL)
    await main.main()
  }
})().catch(console.log)
