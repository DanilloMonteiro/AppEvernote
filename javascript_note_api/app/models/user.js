const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Basicamente um esquema de como vai ser os modelos do banco de dados 

let userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now},
})

// Essa tag pre permite fazermos alteracoes com funcoes antes ou depois de
// fazer operacoes no banco de dados (no caso 'pre' é antes)

// A funcao abaixo transforma a senha em uma senha encripitada e manda no lugar do password

userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    bcrypt.hash(this.password, 10,
      (err, hashedPassword) => {
        if (err)
        next(err)
        else {
          this.password = hashedPassword
          next()
        }
      }
    )
  }
})

// Funcao/metodo para comparar as senhas
userSchema.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, same) {
    if(err)
      callback(err)
    else {
      callback(err, same)
    }
  }) 
}

module.exports = mongoose.model('User', userSchema)