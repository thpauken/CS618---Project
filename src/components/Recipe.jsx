// src/components/Recipe.jsx

import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { deleteRecipe as deleteRecipeApi } from '../api/recipes.js'
import { useState } from 'react'

export function Recipe({
  _id,
  title,
  ingredients,
  instructions,
  tags,
  author,
  onDelete,
}) {
  const [token] = useAuth()
  const [deleting, setDeleting] = useState(false)
  // Support author as string or object
  const authorId = typeof author === 'string' ? author : author?._id
  const username = typeof author === 'object' && author?.username
  // Try to get userId from JWT (if you store it in token)
  let userId = null
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.sub
    } catch (e) {
      /* ignore */
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

  return (
    <article>
      <h3>{title}</h3>
      {instructions && <div>{instructions}</div>}

      {ingredients?.length > 0 && (
        <ul>
          {ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      )}

      {tags?.length > 0 && (
        <p>
          <strong>Tags:</strong> {tags.join(', ')}
        </p>
      )}

      {author && (
        <em>
          <br />
          Written by {username ? username : <User id={authorId} />}
        </em>
      )}

      {/* Show delete button if logged in user is the author */}
      {userId && authorId && userId === authorId && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ marginTop: 8 }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </article>
  )
}

Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  instructions: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string,
    }),
  ]),
  onDelete: PropTypes.func,
}
