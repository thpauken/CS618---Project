export const likeRecipe = async (token, recipeId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/like`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!res.ok) throw new Error('Failed to like recipe')
  return await res.json()
}
export const updateRecipe = async (token, recipeId, recipe) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: recipe.title,
        ingredients: recipe.ingredients,
        imageUrl: recipe.imageUrl,
      }),
    },
  )
  if (!res.ok) throw new Error('Failed to update recipe')
  return await res.json()
}
export const getRecipes = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes?` +
      new URLSearchParams(queryParams ?? {}),
  )
  return await res.json()
}

export const createRecipe = async (token, recipe) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: recipe.title,
      ingredients: recipe.ingredients,
      imageUrl: recipe.imageUrl,
    }),
  })
  return await res.json()
}

export const deleteRecipe = async (token, recipeId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!res.ok) throw new Error('Failed to delete recipe')
  return true
}
