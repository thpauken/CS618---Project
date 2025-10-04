import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'

export function RecipeList({
  recipes = [],
  sortBy = 'createdAt',
  sortOrder = 'descending',
}) {
  const [localRecipes, setLocalRecipes] = useState(recipes)

  const handleDelete = (id) => {
    setLocalRecipes((prev) => prev.filter((r) => r._id !== id))
  }

  React.useEffect(() => {
    setLocalRecipes(recipes)
  }, [recipes])

  const sortedRecipes = [...localRecipes].sort((a, b) => {
    let valA, valB
    if (sortBy === 'likes') {
      valA = a.likes?.length || 0
      valB = b.likes?.length || 0
    } else {
      valA = a[sortBy]
      valB = b[sortBy]
    }
    if (valA < valB) return sortOrder === 'ascending' ? -1 : 1
    if (valA > valB) return sortOrder === 'ascending' ? 1 : -1
    return 0
  })

  return (
    <div>
      {sortedRecipes.map((recipe) => (
        <Fragment key={recipe._id || recipe.title}>
          <Recipe
            _id={recipe._id}
            title={recipe.title}
            ingredients={recipe.ingredients}
            imageUrl={recipe.imageUrl}
            author={recipe.author}
            likes={recipe.likes}
            onDelete={handleDelete}
          />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
}
