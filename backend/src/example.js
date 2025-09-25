import { initDatabase } from './db/init.js'
import { Recipe } from './db/models/recipe.js'

await initDatabase()

const recipe = new Recipe({
  title: 'Spaghetti Bolognese',
  author: 'Huseyin Ergin',
  ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion', 'garlic'],
  instructions:
    'Cook spaghetti, prepare sauce with beef and tomatoes, then combine.',
  tags: ['pasta', 'italian', 'dinner'],
})
const createdRecipe = await recipe.save()
await Recipe.findByIdAndUpdate(createdRecipe._id, {
  $set: { title: 'Hello again, Mongoose!' },
})

const recipes = await Recipe.find()
console.log(recipes)
