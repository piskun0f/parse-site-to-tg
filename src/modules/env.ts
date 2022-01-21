import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
})

if (!process.env.BASE_URL) {
  throw new Error('.env file does not have BASE_URL')
}

if (!process.env.DB_URI) {
  throw new Error('.env file does not have DB_URI')
}

if (!process.env.BOT_TOKEN) {
  throw new Error('.env file does not have BOT_TOKEN')
}
