import mongoose from 'mongoose'
import { describe, expect, test } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
const sampleRecipes = [
  {
    title: 'Spaghetti Bolognese',
    author: 'Daniel Bugl',
    ingredients: ['spaghetti', 'ground beef', 'tomato sauce'],
    instructions: 'Cook spaghetti, make sauce, combine.',
    tags: ['pasta', 'italian'],
  },
  {
    title: 'Vegetable Stir Fry',
    author: 'Daniel Bugl',
    ingredients: ['broccoli', 'carrot', 'soy sauce'],
    instructions: 'Stir fry vegetables with soy sauce.',
    tags: ['vegan', 'asian'],
  },
  {
    title: 'Chicken Curry',
    author: 'Daniel Bugl',
    ingredients: ['chicken', 'curry powder', 'coconut milk'],
    instructions: 'Cook chicken, add curry powder and coconut milk.',
    tags: ['indian', 'spicy'],
  },
  {
    title: 'Pancakes',
    ingredients: ['flour', 'milk', 'egg'],
    instructions: 'Mix ingredients and cook on a griddle.',
    tags: ['breakfast'],
  },
]

let createdSampleRecipes = []

beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})
describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})

describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(createdSampleRecipes[0]._id, {
      author: 'Test Author',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.author).toEqual('Test Author')
  })

  test('should not update other properties', async () => {
    await updateRecipe(createdSampleRecipes[0]._id, {
      author: 'Test Author',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Spaghetti Bolognese')
  })

  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(createdSampleRecipes[0]._id, {
      author: 'Test Author',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe('000000000000000000000000', {
      author: 'Test Author',
    })
    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
describe('listing recipes', () => {
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })

  test('should return recipes sorted by creation date descending by default', async () => {
    const recipes = await listAllRecipes()
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipes.map((recipe) => recipe.createdAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const recipes = await listAllRecipes({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(recipes.map((recipe) => recipe.updatedAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.updatedAt),
    )
  })

  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor('Daniel Bugl')
    expect(recipes.length).toBe(3)
  })

  test('should be able to filter recipes by tag', async () => {
    const recipes = await listRecipesByTag('spicy')
    expect(recipes.length).toBe(1)
  })
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Spaghetti Bolognese',
      author: 'Huseyin Ergin',
      ingredients: [
        'spaghetti',
        'ground beef',
        'tomato sauce',
        'onion',
        'garlic',
      ],
      instructions:
        'Cook spaghetti, prepare sauce with beef and tomatoes, then combine.',
      tags: ['pasta', 'italian', 'dinner'],
    }
    const createdRecipe = await createRecipe(recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const recipe = {
      author: 'Huseyin Ergin',
      ingredients: ['unknown ingredient'],
      instructions: 'Recipe with no title',
      tags: ['empty'],
    }
    try {
      await createRecipe(recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
    }
    const createdRecipe = await createRecipe(recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
