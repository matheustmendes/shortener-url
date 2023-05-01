const express = require('express')
const router = express.Router()
const Link = require('../models/link')
const { routes } = require('../app')

router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code

  const result = await Link.findOne({ where: { code } })

  if (!result) return res.sendStatus(404)

  res.render('stats', result.dataValues)
})

router.get('/:code', async (req, res, next) => {
  const code = req.params.code

  const result = await Link.findOne({ where: { code } })

  if (!result) return res.sendStatus(404)

  result.hits++
  await result.save()
  res.redirect('https://' + result.url)
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Shortener' })
})

function generateRandomURL () {
  let text = ''
  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 5; i++) {
    text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
  }
  return text
}

router.post('/new', async (req, res, next) => {
  const url = req.body.url
  const code = generateRandomURL()

  const result = await Link.create({
    url,
    code
  })
  res.render('stats', result.dataValues)
})

module.exports = router
