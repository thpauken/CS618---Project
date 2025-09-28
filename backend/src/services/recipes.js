import { Recipe } from '../db/models/recipe.js'

export async function createRecipe({
  title,
  author,
  ingredients,
  instructions,
  tags,
}) {
  const recipe = new Recipe({ title, author, ingredients, instructions, tags })
  return await recipe.save()
}
async function listRecipes(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Recipe.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options)
}

export async function listRecipesByAuthor(author, options) {
  return await listRecipes({ author }, options)
}

export async function listRecipesByTag(tags, options) {
  return await listRecipes({ tags }, options)
}

export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId)
}

export async function updateRecipe(
  recipeId,
  { title, author, ingredients, instructions, tags },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId },
    { $set: { title, author, ingredients, instructions, tags } },
    { new: true }, // return the updated document
  )
}

export async function deleteRecipe(recipeId) {
  return await Recipe.deleteOne({ _id: recipeId })
}
