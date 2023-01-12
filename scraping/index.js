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
    team: '.fs-table-text_3',
    victories: '.fs-table-text_4',
    loses: '.fs-table-text_5',
    scoredGoals: '.fs-table-text_6',
    concidedGoals: '.fs-table-text_7',
    yellowCards: '.fs-table-text_8',
    redCards: '.fs-table-text_9'
  }

  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

  $rows.each((index, el) => {
    const $el = $(el)

    const leaderBoardEntries = Object.entries(LEADERBOARD_SELECTORS).map(([key, selector]) => {
      const rawValue = $el.find(selector).text()
      return [key, cleanText(rawValue)]
    })

    console.log(leaderBoardEntries)
  })

  const leaderboard = [{
    team: 'Team 1',
    wins: 0,
    loses: 0,
    goalsScored: 0,
    goalsConcided: 0,
    cardsYellow: 0,
    cardsRed: 0
  }]
  // console.log(text);
}

getLeaderBoard()
