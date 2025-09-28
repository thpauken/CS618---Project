// backend/tests/recipes.test.js
import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
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

import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []

beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  sampleRecipes = [
    {
      title: 'Spaghetti Bolognese',
      author: testUser._id,
      ingredients: ['spaghetti', 'ground beef', 'tomato sauce'],
      instructions: 'Cook spaghetti, make sauce, combine.',
      tags: ['pasta', 'italian'],
    },
    {
      title: 'Vegetable Stir Fry',
      author: testUser._id,
      ingredients: ['broccoli', 'carrot', 'soy sauce'],
      instructions: 'Stir fry vegetables with soy sauce.',
      tags: ['vegan', 'asian'],
    },
    {
      title: 'Chicken Curry',
      author: testUser._id,
      ingredients: ['chicken', 'curry powder', 'coconut milk'],
      instructions: 'Cook chicken, add curry powder and coconut milk.',
      tags: ['indian', 'spicy'],
    },
  ]
})

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
    // The author is now populated as an object with _id and username
    expect(recipe.title).toEqual(createdSampleRecipes[0].title)
    expect(recipe.ingredients).toEqual(createdSampleRecipes[0].ingredients)
    expect(recipe.instructions).toEqual(createdSampleRecipes[0].instructions)
    expect(recipe.tags).toEqual(createdSampleRecipes[0].tags)
    const authorObj =
      recipe.author && recipe.author.toObject
        ? recipe.author.toObject()
        : recipe.author
    expect({
      ...authorObj,
      _id: authorObj._id.toString(),
    }).toMatchObject({
      _id: createdSampleRecipes[0].author.toString(),
      username: testUser.username,
    })
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})

describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      instructions: 'new cooking instructions',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.instructions).toEqual('new cooking instructions')
  })
  test('should not update other properties', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      instructions: 'new cooking instructions',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Spaghetti Bolognese')
  })
  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      instructions: 'new cooking instructions',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(
      testUser._id,
      '000000000000000000000000',
      {
        instructions: 'new cooking instructions',
      },
    )
    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe(testUser._id, '000000000000000000000000')
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
    // Sort both arrays by createdAt descending
    const recipesSorted = [...recipes].sort((a, b) => b.createdAt - a.createdAt)
    const expectedSorted = [...createdSampleRecipes].sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipesSorted.map((r) => r._id.toString())).toEqual(
      expectedSorted.map((r) => r._id.toString()),
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
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(3)
  })
  test('should be able to filter recipes by tag', async () => {
    const recipes = await listRecipesByTag('spicy')
    // The only recipe with 'spicy' tag is 'Chicken Curry'
    expect(recipes.length).toBe(1)
    expect(recipes[0].title).toBe('Chicken Curry')
    expect(Array.isArray(recipes[0].tags)).toBe(true)
    expect(recipes[0].tags).toContain('spicy')
  })
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Pancakes',
      ingredients: ['flour', 'milk', 'egg'],
      instructions: 'Mix ingredients and cook on a griddle.',
      tags: ['breakfast'],
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe.title).toBe(recipe.title)
    expect(foundRecipe.ingredients).toEqual(recipe.ingredients)
    expect(foundRecipe.instructions).toBe(recipe.instructions)
    expect(foundRecipe.tags).toEqual(recipe.tags)
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const recipe = {
      ingredients: ['something'],
      instructions: 'Recipe with no title',
      tags: ['empty'],
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
