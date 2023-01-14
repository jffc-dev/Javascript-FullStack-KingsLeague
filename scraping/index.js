import * as cheerio from 'cheerio'

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

    leaderBoard.push(Object.fromEntries(leaderBoardEntries))
  })

  return leaderBoard
}

const leaderBoard = await getLeaderBoard(URLS.leaderboard)
console.log(leaderBoard)
