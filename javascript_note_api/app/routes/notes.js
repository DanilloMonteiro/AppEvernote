var express = require('express');
var router = express.Router();
const Note = require('../models/notes')
const withAuth = require('../middlewares/auth')

// Rota POST para criar uma note
router.post('/', withAuth, async (req, res) => {
  const { title, body } = req.body

  try {
    let note = new Note({ title: title, body:body, author: req.user._id})
    await note.save()
    res.status(200).json(note)
  } catch (error) {
    res.status(500).json({error: 'Problem to create a new note'})
  }
})

// Rota GET para pegar todas as notas de um usuario
router.get('/', withAuth, async(req, res) => {
  try {
    let notes = await Note.find({ author: req.user._id })
    res.json(notes)
  } catch (error) {
    res.json({error: error}).status(500)
  }
})

// Rota GET para procurar uma note
router.get('/search', withAuth, async(req, res) => {
  const { query } = req.query
  try {
    let notes = await Note
      .find({ author: req.user._id })
      .find({ $text: {$search: query }})
    res.json(notes)
  } catch (error) {
    res.json({error: error}).status(500)
  }
})

// Rota PUT para atualizar dados de uma certa note
router.put('/:id', withAuth, async(req, res) => {
  const { title, body } = req.body
  const { id } = req.params

  try {
    let note = await Note.findById(id)
    if(isOwner(req.user, note)){
      let note = await Note.findOneAndUpdate(id, 
        { $set: { title: title, body: body } }, 
        { upsert: true, 'new': true}
        )

        res.json(note)
    } else {
      res.status(403).json({error: 'Permission denied'})
    }
  } catch (error) {
    res.status(500).json({error: 'Problem to update a new note'})
  }
})

// Rota DELETE para deletar uma note pelo ID
router.delete('/:id', withAuth, async(req, res) => {
  const { id } = req.params
    
  try {
    let note = await Note.findById(id)
    console.log(id)
    if(isOwner(req.user, note)){
      console.log(note)
      await note.deleteOne()
      console.log(note)
      res.json({message: 'OK'}).status(204) 
    } else {
      res.status(403).json({error: 'Permission denied'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Problem to delete a new note'})
  }
})

// Rota GET para encontrar uma nota por ID
router.get('/:id', withAuth, async(req, res) => {
  try {
    const { id } = req.params
    let note = await Note.findById(id)
    if(isOwner(req.user, note))
      res.json(note)
    else 
      res.status(403).json({error: 'Permission denied'})
  } catch (error) {
    res.status(500).json({error: 'Problem to get a note'})
  }
})

// Funcao para descobrir se a nota que esta sendo procurada é do usuario que 
// esta procurando para somente ter acesso a suas proprias notas
const isOwner = (user, note) => {
  if(JSON.stringify(user.id) == JSON. stringify(note.author._id))
    return true
  else 
    return false
}

module.exports = router