import { initDatabase } from './db/init.js'
import { Recipe } from './db/models/recipe.js'
import dotenv from 'dotenv'

dotenv.config()
await initDatabase()

const recipe = new Recipe({
  title: 'Hello from the kitchen!',
  author: 'Some Chef',
  contents: 'This recipe is stored in MongoDB using Mongoose.',
  tags: ['test'],
})

await recipe.save()

const recipes = await Recipe.find()
console.log(recipes)
