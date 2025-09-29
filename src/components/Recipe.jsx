import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  deleteRecipe as deleteRecipeApi,
  updateRecipe as updateRecipeApi,
} from '../api/recipes.js'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { EditRecipeForm } from './EditRecipeForm.jsx'

export function Recipe({
  _id,
  title,
  ingredients,
  imageUrl,
  author,
  onDelete,
}) {
  const [token] = useAuth()
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const authorId = typeof author === 'string' ? author : author?._id
  const username = typeof author === 'object' && author?.username
  const queryClient = useQueryClient()
  let userId = null

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.sub
    } catch (e) {
      // ignore invalid token
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    setDeleting(true)
    try {
      await deleteRecipeApi(token, _id)
      if (onDelete) onDelete(_id)
    } catch (err) {
      alert('Failed to delete recipe')
    } finally {
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <EditRecipeForm
        recipe={{ _id, title, ingredients, imageUrl }}
        onSave={async (updated) => {
          await updateRecipeApi(token, _id, updated)
          setEditing(false)
          queryClient.invalidateQueries(['recipes'])
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <article>
      <h3>{title}</h3>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ maxWidth: '100%', maxHeight: 300 }}
        />
      )}

      {ingredients?.length > 0 && (
        <ul>
          {ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      )}

      {author && (
        <em>
          <br />
          Written by {username ? username : <User id={authorId} />}
        </em>
      )}

      {userId && authorId && userId === authorId && (
        <>
          <button
            onClick={() => setEditing(true)}
            style={{ marginTop: 8, marginRight: 8 }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ marginTop: 8 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </>
      )}
    </article>
  )
}

Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string,
    }),
  ]),
  onDelete: PropTypes.func,
}
