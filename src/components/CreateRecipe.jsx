import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')

  const queryClient = useQueryClient()
  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe({ title, author, ingredients, instructions }),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-author'>Author: </label>
        <input
          type='text'
          id='create-author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-ingredients'>Ingredients: </label>
        <textarea
          id='create-ingredients'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-instructions'>Instructions: </label>
        <textarea
          id='create-instructions'
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createRecipeMutation.isPending}
      />
      {createRecipeMutation.isSuccess && (
        <>
          <br />
          Recipe created successfully!
        </>
      )}
    </form>
  )
}
