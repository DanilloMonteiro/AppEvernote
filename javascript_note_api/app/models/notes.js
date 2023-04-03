const mongoose = require('mongoose')

// Basicamente um esquema de como vai ser os modelos do banco de dados 

// A tag author e a referenca de cada nota ter um dono, no caso um usuario

let noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

noteSchema.index({'title': 'text', 'body': 'text'})

module.exports = mongoose.model('Note', noteSchema)