import { useState } from 'react'
import PropTypes from 'prop-types'

export function EditRecipeForm({ recipe, onSave, onCancel }) {
  const [title, setTitle] = useState(recipe.title)
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(', '))
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...recipe,
      title,
      ingredients: ingredients.split(',').map((i) => i.trim()),
      imageUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='edit-title'>Title: </label>
        <input
          type='text'
          name='edit-title'
          id='edit-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='edit-ingredients'>Ingredients: </label>
        <input
          type='text'
          name='edit-ingredients'
          id='edit-ingredients'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='edit-imageUrl'>Image URL: </label>
        <input
          type='text'
          name='edit-imageUrl'
          id='edit-imageUrl'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <br />
      <input type='submit' value='Save' />
      <button type='button' onClick={onCancel} style={{ marginLeft: 8 }}>
        Cancel
      </button>
    </form>
  )
}

EditRecipeForm.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
