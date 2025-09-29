import { Recipe } from '../db/models/recipe.js'
import { User } from '../db/models/user.js'

export async function listAllRecipes(options = {}) {
  const sort = options.sortBy
    ? { [options.sortBy]: options.sortOrder === 'ascending' ? 1 : -1 }
    : { createdAt: -1 }
  return await Recipe.find().sort(sort).populate('author', 'username')
}

export async function listRecipesByAuthor(authorUsername, options = {}) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await Recipe.find({ author: user._id }, null, options).populate(
    'author',
    'username',
  )
}

export async function getRecipeById(id) {
  return await Recipe.findById(id).populate('author', 'username')
}

export async function createRecipe(userId, { title, ingredients, imageUrl }) {
  const recipe = new Recipe({
    title,
    author: userId,
    ingredients,
    imageUrl,
  })
  return await recipe.save()
}

export async function updateRecipe(
  userId,
  recipeId,
  { title, ingredients, imageUrl },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    { $set: { title, ingredients, imageUrl } },
    { new: true },
  )
}

export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({ _id: recipeId, author: userId })
}
