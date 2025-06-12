import { Schema, model } from 'mongoose'

const exposicionSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  audio: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Pasante',
    required: true
  }
}, {
  timestamps: true
})

export default model('Exposicion', exposicionSchema)
