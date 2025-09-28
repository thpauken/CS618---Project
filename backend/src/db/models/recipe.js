import mongoose, { Schema } from 'mongoose'

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    ingredients: [String],
    instructions: String,
    tags: [String],
  },
  { timestamps: true },
)

export const Recipe = mongoose.model('recipe', recipeSchema)
