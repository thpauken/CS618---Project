import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'

export function RecipeList({ recipes = [] }) {
  const [localRecipes, setLocalRecipes] = useState(recipes)

  const handleDelete = (id) => {
    setLocalRecipes((prev) => prev.filter((r) => r._id !== id))
  }

  // Update localRecipes if recipes prop changes
  React.useEffect(() => {
    setLocalRecipes(recipes)
  }, [recipes])

  return (
    <div>
      {localRecipes.map((recipe) => (
        <Fragment key={recipe._id || recipe.title}>
          <Recipe {...recipe} onDelete={handleDelete} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
}
