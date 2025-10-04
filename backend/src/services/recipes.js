import { Recipe } from '../db/models/recipe.js'
import { User } from '../db/models/user.js'

export async function listAllRecipes(options = {}) {
  let sort = { createdAt: -1 }
  if (options.sortBy === 'likes') {
    sort = { likes: -1 }
  } else if (options.sortBy) {
    sort = { [options.sortBy]: options.sortOrder === 'ascending' ? 1 : -1 }
  }
  return await Recipe.find().sort(sort).populate('author', 'username')
}

export async function likeRecipe(userId, recipeId) {
  const recipe = await Recipe.findById(recipeId)
  if (!recipe) return null
  const hasLiked = recipe.likes.some(
    (id) => id.toString() === userId.toString(),
  )
  if (hasLiked) {
    recipe.likes = recipe.likes.filter(
      (id) => id.toString() !== userId.toString(),
    )
  } else {
    recipe.likes.push(userId)
  }
  await recipe.save()
  return recipe
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
