// backend/src/services/recipes.js
import { Recipe } from '../db/models/recipe.js'
import { User } from '../db/models/user.js'

// Get ALL recipes
export async function listAllRecipes(options = {}) {
  const sort = options.sortBy
    ? { [options.sortBy]: options.sortOrder === 'ascending' ? 1 : -1 }
    : { createdAt: -1 }
  return await Recipe.find().sort(sort).populate('author', 'username')
}

// Get recipes by a specific author (username instead of ID)
export async function listRecipesByAuthor(authorUsername, options = {}) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await Recipe.find({ author: user._id }, null, options).populate(
    'author',
    'username',
  )
}

// Get recipes by a tag
export async function listRecipesByTag(tag) {
  return await Recipe.find({ tags: tag }).populate('author', 'username')
}

// Get a recipe by its ID
export async function getRecipeById(id) {
  return await Recipe.findById(id).populate('author', 'username')
}

// Create a new recipe, tied to the logged-in user
export async function createRecipe(
  userId,
  { title, ingredients, instructions, tags },
) {
  const recipe = new Recipe({
    title,
    author: userId,
    ingredients,
    instructions,
    tags,
  })
  return await recipe.save()
}

// Update a recipe, only if the logged-in user is the author
export async function updateRecipe(
  userId,
  recipeId,
  { title, ingredients, instructions, tags },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    { $set: { title, ingredients, instructions, tags } },
    { new: true },
  )
}

export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({ _id: recipeId, author: userId })
}
