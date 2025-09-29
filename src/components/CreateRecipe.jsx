import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [token] = useAuth()

  const queryClient = useQueryClient()
  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, {
        title,
        ingredients: ingredients.split(',').map((i) => i.trim()),
        imageUrl,
      }),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-ingredients'>Ingredients: </label>
        <input
          type='text'
          name='create-ingredients'
          id='create-ingredients'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-imageUrl'>Image URL: </label>
        <input
          type='text'
          name='create-imageUrl'
          id='create-imageUrl'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating....' : 'Create'}
        disabled={!title}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}
