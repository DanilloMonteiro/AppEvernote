require('dotenv').config()
const secret = process.env.JWT_TOKEN

const jwt = require('jsonwebtoken')

const User = require('../models/user')

// Esse middleware faz uma autenticacao se o token é existe e se ele é valido 
// e muda a requisicao inserindo o token nela
// lembrando que o token tem um email ligado nele por isso conseguimos puxar o email pelo token e o token pelo email
const WithAuth = (req, res, next) => {
  const token = req.headers['x-access-token']

  if(!token)
    res.status(401).json({error: 'Unauthorized: no token provided'})
  else {
    jwt.verify(token, secret, (err, decoded) => {
      if(err)
        res.status(401).json({error: 'Unauthorized: no token invalid'})
      else {
        req.email = decoded.email
        User.findOne({email: decoded.email})
        .then(user => {
          req.user= user
          next()
        })
        .catch(err => {
          res.status(401).json({error: err})
        })
      }
    })
  }
}

module.exports = WithAuth