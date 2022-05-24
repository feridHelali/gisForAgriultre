import mongoose, { Schema } from 'mongoose'

const parcelleSchema = new Schema({
  position: {
    type: String
  },
  proprietaire: {
    type: String
  },
  nature: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

parcelleSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      position: this.position,
      proprietaire: this.proprietaire,
      nature: this.nature,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Parcelle', parcelleSchema)

export const schema = model.schema
export default model
