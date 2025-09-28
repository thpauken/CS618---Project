import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { recipeRoutes } from './routes/recipes.js'
import { userRoutes } from './routes/users.js'

const app = express()

app.use(bodyParser.json())
app.use(cors())

recipeRoutes(app)
userRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Recipe API!')
})

export { app }
