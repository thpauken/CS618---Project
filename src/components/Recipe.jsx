import PropTypes from 'prop-types'

export function Recipe({ title, ingredients, instructions, author }) {
  return (
    <article>
      <h3>{title}</h3>
      <div>
        <strong>Ingredients:</strong>
        <ul>
          {ingredients?.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Instructions:</strong>
        <p>{instructions}</p>
      </div>
      {author && (
        <em>
          <br />
          Submitted by <strong>{author}</strong>
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  instructions: PropTypes.string,
  author: PropTypes.string,
}
