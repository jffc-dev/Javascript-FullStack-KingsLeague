import { writeFile, readFile, appendFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'db')
const DB_LOGS = path.join(process.cwd(), 'scraping/logs')

const readDBFile = (fileName) => {
  return readFile(`${DB_PATH}/${fileName}.json`, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDBFile('teams')
export const PRESIDENTS = await readDBFile('presidents')

const dateFormat = (date) => {
  return ('00' + date.getDate()).slice(-2) + '/' +
  ('00' + (date.getMonth() + 1)).slice(-2) + '/' +
  date.getFullYear() + ' ' +
  ('00' + date.getHours()).slice(-2) + ':' +
  ('00' + date.getMinutes()).slice(-2) + ':' +
  ('00' + date.getSeconds()).slice(-2)
}

const writeLog = async(dbName) => {
  const msg = `Leaderboard data was successfully scrapped ${dateFormat(new Date())}.\n`
  return appendFile(`${DB_LOGS}/${dbName}.txt`, msg, (err) => {
    if (err) throw err
    console.log('Saved!')
  })
}

export const writeDBFile = async(dbName, data) => {
  await writeLog(dbName)
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}
