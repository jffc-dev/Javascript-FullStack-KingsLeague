import { Hono } from 'hono'
import leaderboard from '../db/leaderboard.json'

const app = new Hono()

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

export default app
