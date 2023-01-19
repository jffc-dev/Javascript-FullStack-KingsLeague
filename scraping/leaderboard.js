import * as cheerio from 'cheerio'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'db')
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)
// import TEAMS from '../db/teams.json' assert {type: 'json'} Not supported by linter

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

const scrape = async (url) => {
  const res = await fetch(url)
  const text = await res.text()
  return cheerio.load(text)
}

const getLeaderBoard = async (url) => {
  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concidedGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const $ = await scrape(url)
  const $rows = $('table tbody tr')

  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

  const getTeamFromName = ({ name }) => TEAMS.find(team => team.name === name)

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)
  const leaderBoard = []

  $rows.each((_, el) => {
    const $el = $(el)

    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $el.find(selector).text()
      const cleanedValue = cleanText(rawValue)

      const value = typeOf === 'number'
        ? Number(cleanedValue)
        : cleanedValue

      return [key, value]
    })

    const { team: teamName, ...leaderBoardForTeam } = Object.fromEntries(leaderBoardEntries)

    const team = getTeamFromName({ name: teamName })

    leaderBoard.push({
      ...leaderBoardForTeam,
      team
    })
  })

  return leaderBoard
}

const leaderBoard = await getLeaderBoard(URLS.leaderboard)
// console.log(import.meta.url)
// console.log(path.join(process.cwd()))
await writeFile(`${DB_PATH}/leaderboard.json`, JSON.stringify(leaderBoard, null, 2), 'utf-8')
